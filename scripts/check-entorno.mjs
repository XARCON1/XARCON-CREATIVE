// Runs against an ephemeral Vite server with an in-memory project. No Firebase
// session or production data is needed to exercise the protected components.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const root=process.cwd();
const fixture=await mkdtemp(join(root,"qa-entorno-"));
const proofs=process.env.ENTORNO_QA_DIR||await mkdtemp(join(tmpdir(),"entorno-proof-"));
await mkdir(proofs,{recursive:true});
const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0"><div id="root"></div><script type="module" src="./app.tsx"></script></body>';
const app=`
import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import CommanderRoutes from "../src/admin/commander/CommanderRoutes";
import "../src/styles/global.css";
import "../src/admin/admin.css";
const w={projects:[{id:"qa",name:"Proyecto de prueba",status:"Planificación"}],connection:"live"};
createRoot(document.getElementById("root")).render(<MemoryRouter initialEntries={["/admin/commander/entorno"]}><CommanderRoutes workspace={w}/></MemoryRouter>);
`;
let server,browser;
try {
  await writeFile(join(fixture,"index.html"),html);await writeFile(join(fixture,"app.tsx"),app);
  server=await createServer({root,logLevel:"error",server:{host:"127.0.0.1",port:0,strictPort:true}});
  await server.listen();
  const url="http://127.0.0.1:"+server.httpServer.address().port;
  const fixtureURL=url+"/"+basename(fixture)+"/index.html";
  const executablePath=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/chromium",chromium.executablePath()].find(p=>p&&existsSync(p));
  browser=await chromium.launch({executablePath,headless:true,args:["--enable-unsafe-swiftshader","--use-angle=swiftshader","--disable-dev-shm-usage"]});
  const page=await browser.newPage({viewport:{width:1280,height:820},deviceScaleFactor:1});
  page.setDefaultTimeout(30000);
  const errors=[],models=new Set();
  page.on("pageerror",e=>errors.push(e.message));
  page.on("console",m=>{if(/No se pudo cargar el modelo|THREE.WebGLProgram: Shader Error/.test(m.text()))errors.push(m.text());});
  page.on("response",r=>{const u=new URL(r.url());if(r.ok()&&u.pathname.endsWith(".glb")&&!u.search.includes("import")&&!u.search.includes("url"))models.add(u.pathname);});
  const button=(name)=>page.getByRole("button",{name,exact:true});
  // The production route must stop at the existing identity gate.
  await page.goto(url+"/admin/commander/entorno");
  await page.getByRole("heading",{name:/Acceso privado/}).waitFor();assert.equal(models.size,0);
  await page.goto(fixtureURL);
  await page.getByLabel("Planta corporativa 3D interactiva de XARCON").waitFor();
  await page.waitForFunction(()=>!document.querySelector(".xe-load")&&!document.querySelector(".xe-plan"),{},{timeout:60000});
  assert.equal(models.size,7,"Se deben cargar los siete archivos GLB");
  const frames=await page.evaluate(()=>new Promise(done=>{
    const deltas=[];let previous=performance.now();
    function sample(now){deltas.push(now-previous);previous=now;if(deltas.length<18)requestAnimationFrame(sample);else done(deltas.slice(1).sort((a,b)=>a-b));}
    requestAnimationFrame(sample);
  }));
  console.log("Intervalo mediano de cuadro en Chromium con SwiftShader (ms):",frames[Math.floor(frames.length/2)].toFixed(1));
  await page.screenshot({path:join(proofs,"planta.png")});
  const camera=page.getByLabel("Perspectiva de cámara");
  await camera.selectOption("orbit");
  await page.mouse.move(540,420);await page.mouse.down();await page.mouse.move(615,427,{steps:5});await page.mouse.up();
  await button("Departamentos").click();await page.getByRole("button",{name:/^FORGE Laboratorio/}).click();
  await page.getByRole("heading",{name:"FORGE"}).waitFor();await button("Seguir agente").click();
  assert.equal(await camera.inputValue(),"follow");await page.waitForTimeout(1400);
  await page.screenshot({path:join(proofs,"agente.png")});
  await camera.selectOption("department");await page.waitForTimeout(1300);
  await page.screenshot({path:join(proofs,"departamento.png")});
  await camera.selectOption("interior");await button("Avanzar").waitFor();
  const canvas=page.getByLabel("Planta corporativa 3D interactiva de XARCON");
  await canvas.focus();await page.keyboard.down("w");await page.waitForTimeout(320);await page.keyboard.up("w");
  await camera.selectOption("cinema");await button("Volver a la vista general").click();assert.equal(await camera.inputValue(),"overview");
  await button("Calidad gráfica").click();await button("Plano 2D").click();
  await button("Estación de PRISM").click();await page.getByRole("heading",{name:"PRISM"}).waitFor();
  await button("Cerrar panel").click();await button("Misiones").click();
  await page.getByLabel("Origen").selectOption("workspace");
  await page.getByLabel("Objetivo").fill("Validar la entrega entre departamentos");
  await page.getByLabel("Velocidad").selectOption("4");await button("Iniciar simulación").click();
  await button("Pausar").click();await page.getByRole("link",{name:"Commander",exact:true}).click();
  await button("Reanudar").waitFor();assert.equal(await page.getByLabel("Objetivo de misión").inputValue(),"Validar la entrega entre departamentos");
  await button("Reanudar").click();await page.getByRole("link",{name:"Entorno",exact:true}).click();
  await button("Misiones").click();await button("Aprobar").waitFor({timeout:60000});await button("Aprobar").click();await button("Misión aprobada").waitFor();
  await page.setViewportSize({width:390,height:844});
  await button("Calidad gráfica").click();await button("Plano 2D").click();await button("Agente ATLAS").click();
  await page.getByRole("heading",{name:"ATLAS",exact:true}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),"Desbordamiento horizontal móvil");
  await page.screenshot({path:join(proofs,"plano-movil.png")});
  assert.deepEqual(errors,[]);console.log("WebGL 2, siete modelos, seis cámaras, acceso privado, misión compartida, aprobación y plano móvil verificados.");
} finally {
  await browser?.close();await server?.close();await rm(fixture,{recursive:true,force:true});
}

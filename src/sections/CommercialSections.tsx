import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductDemo } from "../components/ProductDemo";
import Reveal from "../components/Reveal";
import Button from "../components/Button";
const projects = [
{ name:"ACOS Seguros", sector:"Seguros / software empresarial", status:"En desarrollo", problem:"Centralizar la operación de una intermediaria de seguros.", solution:"Web comercial y plataforma privada; gestión por áreas y portal de clientes en desarrollo.", value:"Organización de procesos y acceso según responsabilidades." },
{ name:"Diamantes Realty Group", sector:"Bienes raíces / gestión", status:"Proyecto desarrollado", logo:"diamantes-realty-group.webp", problem:"Unificar la promoción y gestión de propiedades.", solution:"Catálogo, filtros, mapa, fichas y paneles de agentes.", value:"Facilitar la búsqueda y el seguimiento inmobiliario.", url:"https://diamantesrealtygroup.com/" },
{ name:"AVALNICA", sector:"Avalúos / gestión", status:"Proyecto en evolución", logo:"avalnic.svg", problem:"Organizar la elaboración de avalúos.", solution:"Plataforma de gestión de avalúos y generación de documentos PDF.", value:"Estructurar el trabajo y sus entregables." },
{ name:"DOLCE", sector:"Repostería / comercio electrónico", status:"Proyecto desarrollado", problem:"Digitalizar la presentación de productos y la recepción de pedidos.", solution:"Catálogo, pedidos y panel de administración.", value:"Simplificar el recorrido entre el producto y la solicitud." },
{ name:"Isabel Valenzuela", sector:"Bienes raíces / web corporativa", status:"En desarrollo", problem:"Crear una presencia inmobiliaria independiente.", solution:"Web de propiedades y guías para compra, venta y renta.", value:"Orientar consultas de compradores y propietarios." },
{ name:"Amy Blandón", sector:"Servicios / web corporativa", status:"Proyecto desarrollado", logo:"amy-blandon.webp", problem:"Presentar servicios de bienes raíces y seguros.", solution:"Web profesional con secciones dedicadas a ambas áreas.", value:"Comunicar la oferta y facilitar el contacto.", url:"https://amyblandon.com/" },
{ name:"Pequeños Escritores", sector:"Educación / aplicación", status:"Proyecto desarrollado", logo:"pequenos-escritores.webp", problem:"Apoyar el aprendizaje inicial de escritura.", solution:"Actividades de trazos, audio de letras y seguimiento de progreso.", value:"Ofrecer una experiencia de práctica digital." },
{ name:"Germina", sector:"Innovación / proyecto académico", status:"Proyecto de portafolio", logo:"germina.svg", problem:"Comunicar una propuesta de innovación.", solution:"Experiencia web del proyecto.", value:"Presentar la propuesta en un formato digital." }
];

const visuals = [
  {color:"sea",mode:0,features:["Gestión por áreas","Portal de clientes","Seguros"]},
  {color:"blue",mode:1,features:["Catálogo","Mapa","Panel de agentes"],photo:"https://www.diamantesrealtygroup.com/_next/image?url=%2Fassets%2Fimagenhero1.jpeg&w=1080&q=75"},
  {color:"lilac",mode:0,features:["Avalúos","PDF","Gestión"]},
  {color:"peach",mode:3,features:["Catálogo","Pedidos","Administración"]},
  {color:"sky",mode:1,features:["Propiedades","Guías","Consultas"]},
  {color:"mint",mode:1,features:["Bienes raíces","Seguros","Contacto"]},
  {color:"yellow",mode:1,features:["Trazos","Audio","Progreso"]},
  {color:"violet",mode:1,features:["Innovación","Presentación digital"]},
];
const captions = ["Software de gestión para seguros.","Una operación inmobiliaria conectada.","Avalúos y documentos en un solo lugar.","Del catálogo digital al pedido.","Una presencia inmobiliaria independiente.","Bienes raíces y seguros, conectados.","Aprendizaje interactivo de la escritura.","Una propuesta de innovación digital."];
const reasons = [
["A tu medida","Tecnología que se adapta a tu operación."],
["Ejecución ágil","Etapas claras y avances visibles."],
["IA aplicada","Automatización donde aporta valor."],
["Diseño y evolución","Experiencias cuidadas y soporte acordado."]
];
export default function CommercialSections(){return <section id="proyectos" className="commercial-portfolio">
<div className="wrap"><Reveal className="commercial-heading"><div><span className="eyebrow">PORTAFOLIO / TRABAJO REAL</span><h2>Ideas que ya <em>se construyen.</em></h2></div><p>Proyectos de distintos sectores, con soluciones propias.</p></Reveal>
<div className="commercial-cases">{projects.map((project,i)=>{const v=visuals[i];return <Reveal key={project.name} className={"commercial-case project-"+v.color+(i<2?" project-featured":"")} variant="media"><div className="project-art">
{v.photo ? <div className="project-public-photo" style={{backgroundImage:"url("+v.photo+")"}} aria-hidden="true"/> : i<2 ? <div className="project-screen" aria-hidden="true"><ProductDemo index={v.mode}/></div> : <div className="project-brand-art" aria-hidden="true"><div className="project-brand-window"><div className="project-window-top"><i/><i/><i/></div>{project.logo?<img src={"/brands/clients/"+project.logo} alt="" loading="lazy" decoding="async"/>:<strong>{project.name}</strong>}<div className="project-mini-lines"><i/><i/><i/></div></div><div className="project-feature-stack">{v.features.map((f,n)=><span key={f}><i>0{n+1}</i>{f}</span>)}</div></div>}
<div className="project-art-caption">{v.photo?"Imagen pública del proyecto":i<2?"Vista conceptual de producto":"Composición de portafolio"}</div>
</div><div className="project-info"><div className="commercial-case-top"><span>{project.sector}</span><span>{project.status}</span></div><h3>{project.name}</h3><p>{captions[i]}</p><div className="project-info-actions">{project.url&&<a href={project.url} target="_blank" rel="noopener noreferrer">Visitar web <ArrowUpRight size={15}/></a>}<details><summary>Ver alcance</summary><div><p>{project.problem}</p><p>{project.solution}</p><p>{project.value}</p></div></details></div></div></Reveal>})}</div><div className="commercial-action"><p>Tu próximo proyecto empieza aquí.</p><Button>Solicitar propuesta</Button></div></div></section>}
export function WhyXarcon(){return <section className="commercial-why"><div className="wrap"><Reveal className="section-heading"><div><span className="eyebrow">POR QUÉ XARCON</span><h2>Construimos contigo.<br/>No desde una plantilla.</h2></div><Link className="text-link" to="/nosotros">Conócenos <ArrowUpRight size={17}/></Link></Reveal><div className="commercial-reasons">{reasons.map(([title,description],i)=><Reveal key={title} className="commercial-reason"><span>0{i+1}</span><h3>{title}</h3><p>{description}</p></Reveal>)}</div></div></section>}

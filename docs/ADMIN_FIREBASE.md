# XARCON HQ — Firebase Authentication

## Objetivo

XARCON HQ usa Google Sign-In mediante Firebase Authentication. El frontend solo habilita el
Admin cuando la identidad cumple simultáneamente:

- proveedor: `google.com`;
- correo verificado;
- correo Owner autorizado: `norvingarcia220@gmail.com`.

Cualquier otra cuenta se cierra inmediatamente.

## Configuración pendiente en Firebase

1. Registrar una Web App para XARCON HQ.
2. Habilitar Authentication > Sign-in method > Google.
3. Añadir `xarcon-creative.vercel.app` a Authentication > Settings > Authorized domains.
4. Copiar la configuración pública de la Web App a Vercel usando:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

Estas variables son configuración cliente. Nunca usar aquí service-account JSON, private keys
ni credenciales de Firebase Admin SDK.

## Reglas: principio obligatorio

El chequeo del correo en React mejora la UX, pero NO es una frontera de seguridad para Firestore
o Storage. Cuando XARCON HQ empiece a persistir datos, las reglas deben volver a validar la
identidad autenticada.

Para una primera etapa Owner-only, la condición base recomendada es:

```
request.auth != null
&& request.auth.token.email_verified == true
&& request.auth.token.email == "norvingarcia220@gmail.com"
&& request.auth.token.firebase.sign_in_provider == "google.com"
```

### Firestore — referencia Owner-only

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isXarconOwner() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email == "norvingarcia220@gmail.com"
        && request.auth.token.firebase.sign_in_provider == "google.com";
    }

    match /{document=**} {
      allow read, write: if isXarconOwner();
    }
  }
}
```

### Storage — referencia Owner-only

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isXarconOwner() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email == "norvingarcia220@gmail.com"
        && request.auth.token.firebase.sign_in_provider == "google.com";
    }

    match /{allPaths=**} {
      allow read, write: if isXarconOwner();
    }
  }
}
```

## Evolución RBAC

Cuando se incorporen colaboradores, no extender la allowlist con lógica dispersa en componentes.
La ruta prevista es:

1. mantener Firebase Auth como identidad;
2. asignar rol/divisiones/permisos desde una fuente administrativa;
3. emitir custom claims o usar documentos de membresía seguros;
4. reflejar permisos en UI;
5. hacer cumplir los mismos permisos en Firestore/Storage Rules.

Nexus permanece independiente y, si se conecta más adelante, debe hacerlo mediante una API
autorizada; no compartiendo directamente credenciales o base de datos.

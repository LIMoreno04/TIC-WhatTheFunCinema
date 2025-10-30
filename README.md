# WhatTheFun Cinema Web app
## Requerimientos / Requirements
- Java 21
- Node.js

---

## Como ejecutar / How to run

#### ESP
Si se está en Windows, ejecutar `run.bat`. En Mac o Linux ejecutar `run.sh`.  
Se instalarán todas las dependencias y se ejecutarán las aplicaciones de Backend y Frontend por separado. No se deben cerrar las ventanas emergentes.  
Al finalizar las instalaciones, la aplicación web se abrirá por defecto en el puerto 3000.

#### ENG
If you're on Windows, run `run.bat`. On macOS or Linux run `run.sh`.  
All dependencies will be installed and the Backend and Frontend applications will be started separately. Do not close the pop-up windows.  
When the installations finish, the web application will open by default on port 3000.

---

## Como usar / How to use

#### ESP
Solo la cuenta administrador es capaz de agregar instancias de funciones, películas, cines, o snacks, tanto desde el burger menu como desde el panel de la pantalla principal.  
Las credenciales de la cuenta administrador son:
- email: admin@admin.com
- contraseña: Admin@admin777
Un usuario creado mediante la interacción de "Registrarse" será de tipo "customer" y tendrá acceso a su pantalla de perfil donde podrá editar su información personal y agregar métodos de pago (solo se verifica que el número de tarjeta sean 16 dígitos).  
Como usuario "customer" se podrá comprar entradas a funciones y snacks, compras que pueden ser visitadas en el historial de compras del burger menu, y pueden ser canceladas hasta 2 horas antes de que comience la función.  
Todos los datos son persistentes entre sesiones.

Detalle a notar: Las películas están separadas en 3 categorías:
- **En cartelera**: Son las películas con borde celeste, y se calculan dinámicamente como aquellas películas que tuvieron una función en los últimos 7 días y además tienen una función en los próximos 7 días.
- **Próximamente**: Son las películas con borde rojo y se calculan dinámicamente como aquellas que no tienen ninguna función en los últimos 7 días, pero sí tienen funciones en el futuro.
- **Históricas**: Son las películas con borde violeta, únicamente visibles en la pantalla de películas, y se calculan dinámicamente como aquellas que solo tienen funciones en el pasado.

Se motiva la experiencia de esta funcionalidad mediante la creación de una función (en la cuenta administrador) asignada a un futuro cercano (próximos 5 minutos), y otra función asignada a un futuro un poco posterior (próximos 10 minutos), para de esta manera ver en tiempo real como la película comienza en rojo (próximamente), en 5 minutos cambia a celeste (en cartelera), y 5 minutos después cambia a violeta (histórica).

#### ENG
Only the administrator account can add screening instances, movies, cinemas, or snacks—either from the burger menu or from the main screen panel.  
Administrator account credentials are:
- email: admin@admin.com
- password: Admin@admin777
A user created via the "Registrarse" flow will be of type `customer` and will have access to their profile screen where they can edit personal information and add payment methods (only the card number is validated to be 16 digits).  
As a `customer` you can purchase tickets and snacks; purchases can be viewed in the purchase history within the burger menu, and can be canceled up to 2 hours before the screening starts.  
All data is persistent across sessions.

Note: Movies are divided into 3 categories:
- **Now showing**: Movies with a light-blue border. Dynamically computed as movies that had a screening in the past 7 days and also have a screening in the next 7 days.
- **Coming soon**: Movies with a red border. Computed as movies that had no screenings in the past 7 days but have screenings scheduled in the future.
- **Historical**: Movies with a purple border, visible only on the movies "películas" screen. Computed as movies that only have past screenings.

You can experience this feature by creating a screening (using the administrator account) scheduled in the near future (about 5 minutes from now) and another screening scheduled slightly later (about 10 minutes from now). This lets you see in real time how the movie starts as red (coming soon), after 5 minutes switches to light-blue (now showing), and 5 minutes later switches to purple (historical and only on the "películas" screen).



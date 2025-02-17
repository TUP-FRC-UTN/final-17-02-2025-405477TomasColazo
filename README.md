[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YolWDkHC)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18250093&assignment_repo_type=AssignmentRepo)
# **Desarrollo del Juego de adivinar palabras con Angular**

## **Objetivo**
Desarrollar una aplicación web en Angular 18 que implemente el juego de adivinar palabras, utilizando formularios reactivos, validaciones, autenticación de usuarios y comunicación con una API REST para gestionar palabras y puntuaciones. La aplicación deberá ser intuitiva, responsive y seguir buenas prácticas de desarrollo.

---

## **Requerimientos Técnicos**
1. **Angular CLI 18.x**: Para la creación y gestión del proyecto.
2. **Bootstrap 5.x**: Para estilos y diseño responsive.
3. **Mock API**: Para simular la API REST.
4. **RxJS**: Para manejo de observables y peticiones HTTP.

---

## **Estructura del Proyecto**

### **1. Juego de adivinar palabras**
#### **1.1 Lógica del Juego**
- El juego seleccionará una palabra aleatoria desde la API REST.
- El jugador tendrá un máximo de 6 intentos para adivinar la palabra.
- La interfaz gráfica deberá incluir:
    - La palabra oculta representada con guiones bajos (`_ _ _ _`).
    - Letras incorrectas ya seleccionadas.
    - Letras correctas ya seleccionadas.
    - Un dibujo del personaje que se completa progresivamente con cada error (ver ejemplo SVG al final).
    - Un teclado virtual para seleccionar las letras.
- Cuando el jugador adivine la palabra, se mostrará un mensaje de victoria y se guardará su puntuación.
- Si el jugador no adivina la palabra, se mostrará un mensaje de derrota.

#### **1.2 Puntuaciones**
- Guardar la puntuación del jugador en la API REST (nombre del usuario, palabra adivinada, intentos restantes y fecha).
- Mostrar una tabla de puntuaciones en la pantalla de resultados, ordenada por la cantidad de intentos restantes.
- **Roles de Usuario**:
    - **student**: Solo podrá ver sus propias puntuaciones.
    - **admin**: Podrá ver todas las puntuaciones.

---

### **2. Formularios Reactivos**
#### **2.1 Formulario de Inicio de Sesión**
- Campos:
    - Nombre de usuario (requerido, mínimo 3 caracteres).
    - Contraseña (requerida, mínimo 6 caracteres).
- Validaciones:
    - Verificar que los campos no estén vacíos.
    - Mostrar mensajes de error claros para cada validación.

---

### **3. Sistema de Autenticación**
- Crear un sistema de autenticación para los usuarios.
- Los usuarios podrán iniciar sesión con su nombre de usuario y contraseña. Si las credenciales no coinciden, se mostrará un mensaje de error.
- Una vez autenticado, se debe pasar el parámetro name por la ruta para mostrar un mensaje de bienvenida en el navbar (por ejemplo: "Bienvenido, Pepito").
- Los usuarios podrán cerrar sesión en cualquier momento.
- Proteger las rutas de la aplicación para que solo los usuarios autenticados puedan acceder a ellas.
- **Roles**:
    - **student**: Acceso limitado a las funcionalidades del juego y sus puntuaciones.
    - **admin**: Acceso completo a todas las puntuaciones y gestión de usuarios.
      
## **Explicación para el Inicio de Sesión**
Los usuarios deberán iniciar sesión utilizando su correo electrónico institucional con el formato `legajo@tecnicatura.frc.utn.edu.ar` y su legajo correspondiente como contraseña. Es importante validar que el dominio del correo sea el correcto.
---

### **4. Comunicación con la API REST**
#### **Endpoints de la API**
1. **Palabras**
    - **GET** `/words`: Obtener lista de palabras para el juego.
2. **Puntuaciones**
    - **GET** `/scores`: Obtener lista de puntuaciones.
    - **POST** `/scores`: Guardar una nueva puntuación.
3. **Usuarios**
    - **GET** `/users?username={}&password={}`: Login.

---

### **5. Algoritmo de Procesamiento**
- Generar un identificador único para cada partida:
  1. Realizar un **GET** al endpoint de puntuaciones (`/scores?playerName={}`).
  2. Contar la cantidad de partidas jugadas por el usuario (a partir de la respuesta del endpoint).
  3. Crear un identificador en el formato `P + cantidad de partidas jugadas + iniciales del nombre completo`.
     - Si el usuario se llama "Lionel Andres Messi", con diez partidas jugadas, el identificador será `P10LAM`.
     - Si el usuario se llama "Cristiano Ronaldo", con siete partidas jugadas, sería `P7CR`.
     - Utilizar las iniciales del primer nombre o nombres y el apellido.
- Calcular la puntuación basada en la cantidad de intentos restantes:
    - 6 intentos restantes: 100 puntos.
    - 5 intentos restantes: 80 puntos.
    - 4 intentos restantes: 60 puntos.
    - 3 intentos restantes: 40 puntos.
    - 2 intentos restantes: 20 puntos.
    - 1 intento restante: 10 puntos.
    - 0 intentos restantes: 0 puntos.

---

## **Documentación de la API**

### **1. Endpoint de Palabras**
**URL**: `https://671fe287e7a5792f052fdf93.mockapi.io/words`  
**Descripción**: Obtiene la lista de palabras para el juego.

#### Formato de Respuesta (GET):
```json
[
  {
    "id": "1",
    "word": "angular",
    "category": "tecnología"
  }
]
```

### **2. Endpoint de Puntuaciones**
**URL**: `https://671fe287e7a5792f052fdf93.mockapi.io/scores`  
**Descripción**: Gestiona las puntuaciones de los jugadores.

#### Formato de Respuesta (GET):
```json
[
  {
    "playerName": "Cristiano Ronaldo",
    "word": "angular",
    "attemptsLeft": 4,
    "score": 60,
    "date": "2024-10-28",
    "idGame": "P1CR",
    "id": "1"
  },
  {
    "playerName": "Lionel Andres Messi",
    "word": "angular",
    "attemptsLeft": 4,
    "score": 60,
    "date": "2024-10-28",
    "idGame": "P1LAM",
    "id": "2"
  }
]

```

#### Formato de Solicitud (POST):
```json
{
    "playerName": "Cristiano Ronaldo",
    "word": "angular",
    "attemptsLeft": 4,
    "score": 60,
    "date": "2024-10-28",
    "idGame": "P1CR",
    "id": "1"
  }
```

### **3. Endpoint de Usuarios**
**URL**: `https://679b8dc433d31684632448c9.mockapi.io/users`  
**Descripción**: Gestiona la autenticación de los usuarios.

#### Formato de Respuesta (GET):
```json
 [
    {
      "id": 1,
      "username": "admin",
      "password": "admin123",
      "role": "admin"
    }
  ]
```

---

## **Rutas del Proyecto**
La aplicación tendrá las siguientes rutas:
1. **/login**: Para que los usuarios puedan iniciar sesión.
2. **/game**: Pantalla del juego donde los usuarios pueden jugar.
3. **/scores**: Pantalla de puntuaciones.
    - **Para players**: Solo podrán ver sus puntuaciones personales.
    - **Para admins**: Podrán ver todas las puntuaciones de todos los usuarios.


---

## **Diseño Gráfico (SVG del Personaje)**
```html
<svg width="200" height="300">
    <!-- Dibujo del personaje -->
    <circle cx="150" cy="120" r="20" fill="black" /> <!--cabeza--->
    <line x1="150" y1="140" x2="150" y2="200" stroke="black" /> <!--cuerpo-->
    <line x1="150" y1="150" x2="130" y2="180" stroke="black"/> <!--brazo izquierdo-->
    <line x1="150" y1="150" x2="170" y2="180" stroke="black"  /> <!--brazo derecho-->
    <line x1="150" y1="200" x2="130" y2="240" stroke="black"  /> <!--pierna izquierda-->
    <line x1="150" y1="200" x2="170" y2="240" stroke="black"  /> <!--pierna derecha-->
</svg>
```

---

## **Mockup**
En la carpeta `assets` encontrarán las imágenes con los estilos de la aplicación.

---

## **Tabla de Evaluación**

| Criterio                   | Puntos |
|----------------------------|--------|
| Lógica del Juego           | 40     |
| Formularios Reactivos      | 20     |
| Validaciones de Formulario | 10     |
| Sistema de Autenticación   | 20     |
| Estilos y Diseño Responsive| 10     |
| **Total**                  | **100**|

---



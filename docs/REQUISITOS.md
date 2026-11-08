# PROYECTO 27 — APLICACIÓN PERSONAL DE HÁBITOS, APRENDIZAJE Y DESARROLLO

Quiero desarrollar una aplicación web personal llamada **27**. Su finalidad es ayudarme a organizar mi vida, mantener hábitos, aprender cosas nuevas, seguir mi evolución académica y personal y registrar mis progresos a largo plazo.

No es una aplicación comercial. Es una herramienta para uso personal.

Quiero que sea práctica, flexible y completa, pero sin convertir el seguimiento de mi vida en otra obligación. Registrar algo debe ser rápido y sencillo. No quiero formularios innecesarios ni tener que rellenar información que no me apetezca.

**IMPORTANTE:** No impongas decisiones sobre el diseño visual, colores, tipografías, distribución de pantallas, animaciones o estilo gráfico. Decide libremente cómo implementar la interfaz y la experiencia de usuario, siempre que sea intuitiva, funcional y cómoda. Lo importante en este encargo son las funcionalidades, la estructura de los datos y el comportamiento de la aplicación.

---

# 1. ESTRUCTURA GENERAL

La aplicación debe diferenciar claramente cuatro grandes ámbitos:

1. **Hábitos:** actividades que quiero mantener de forma recurrente.
2. **Formación personal:** conocimientos y habilidades que quiero desarrollar por iniciativa propia.
3. **Estudios académicos:** seguimiento de mis notas y resultados en 2.º de Bachillerato.
4. **Extras y experiencias:** actividades puntuales que decida realizar y quiera guardar, sin convertirlas en hábitos.

También quiero disponer de:
- Un historial de mi actividad.
- Estadísticas y evolución personal.
- Objetivos a largo plazo.
- Una cita o curiosidad diaria.
- Un espacio para comentarios y reflexiones.

Todos estos apartados deben estar relacionados cuando tenga sentido, pero sin mezclar datos que pertenezcan a categorías diferentes.

# 2. HÁBITOS

Inicialmente quiero tener estos siete hábitos:

1. Caminar 10.000 pasos.
2. Dejar el móvil fuera del dormitorio al irme a dormir.
3. Aprender Python.
4. Preparar matemáticas.
5. Leer al menos 10 páginas.
6. Estirar.
7. Entrenar.

Los hábitos deben poder modificarse, eliminarse o añadirse en cualquier momento.

Cada hábito debe tener:
- Nombre editable.
- Descripción opcional.
- Objetivo.
- Frecuencia: diaria, determinados días de la semana o personalizada.
- Fecha de inicio.
- Posibilidad de pausarlo.
- Posibilidad de archivarlo.
- Posibilidad de modificar su objetivo.

## Registro diario

Marcar un hábito como completado debe ser suficiente para registrarlo.

Los datos adicionales serán siempre opcionales.

Ejemplos:

- **Pasos:** marcar como completado y, opcionalmente, introducir la cifra exacta.
- **Móvil:** simplemente marcar si he dejado el móvil fuera del dormitorio.
- **Python:** marcar como completado y, opcionalmente, registrar minutos, contenido aprendido y comentarios.
- **Matemáticas:** marcar como completado y, opcionalmente, indicar qué he estudiado.
- **Lectura:** marcar como completado y, opcionalmente, registrar páginas.
- **Estiramientos:** marcar como completado y, opcionalmente, indicar duración.
- **Entrenamiento:** marcar como completado y, opcionalmente, indicar tipo de entrenamiento, duración e intensidad.

No quiero que registrar minutos, cantidades o comentarios sea obligatorio.

## Días de descanso y exclusiones

Quiero poder excluir manualmente un hábito de un día concreto.

Por ejemplo, si un día decido descansar del entrenamiento, puedo excluir ese hábito.

Reglas:
- Un hábito excluido no cuenta como completado.
- Tampoco cuenta como incumplido.
- No debe perjudicar el porcentaje de cumplimiento.
- Puedo modificar o retirar la exclusión posteriormente.
- No debe existir una programación automática de descansos que decida por mí.

## Porcentaje diario

Quiero ver cuántos hábitos he completado respecto a los que tenía previstos ese día.

Ejemplo:
- 4 hábitos completados.
- 2 hábitos pendientes.
- 1 hábito excluido.

Resultado: 4/6 = 66,7 %.

Los hábitos excluidos no entran en el denominador.

# 3. FORMACIÓN PERSONAL

Este apartado es independiente de mis estudios oficiales de Bachillerato.

Su objetivo es registrar todo lo que aprendo por iniciativa propia y preparar mis conocimientos para el futuro.

Quiero poder crear diferentes áreas de aprendizaje y seguir su evolución.

Inicialmente debe incluir:

## Matemáticas — preparación personal

Quiero prepararme matemáticamente de cara a futuros estudios universitarios relacionados con Inteligencia Artificial, Ciencia de Datos, Informática o Ingeniería.

Este apartado puede incluir:
- Álgebra.
- Funciones.
- Trigonometría.
- Logaritmos.
- Probabilidad.
- Estadística.
- Cálculo.
- Derivadas e integrales.
- Álgebra lineal.
- Matrices.
- Vectores.

Debe permitirme registrar:
- Qué he estudiado.
- Cuánto tiempo he dedicado, opcionalmente.
- Qué he aprendido.
- Dificultades encontradas.
- Comentarios.
- Mi progreso a lo largo del tiempo.

## Inglés — formación personal

Quiero mejorar mi inglés general, independientemente de la asignatura de Inglés de Bachillerato.

El objetivo es alcanzar un nivel que me permita desenvolverme en estudios universitarios internacionales y en un futuro profesional.

Quiero poder registrar actividades como:
- Vocabulario.
- Gramática.
- Listening.
- Reading.
- Writing.
- Speaking.
- Conversación.
- Preparación de exámenes oficiales.

Debe permitir registrar opcionalmente tiempo dedicado, contenido trabajado, dificultades y avances.

## Python y programación

Quiero aprender programación desde cero.

Este apartado debe permitir registrar:
- Temas estudiados.
- Conceptos aprendidos.
- Ejercicios realizados.
- Proyectos desarrollados.
- Tiempo dedicado, opcionalmente.
- Dificultades y observaciones.

## Otras áreas de aprendizaje

Quiero poder crear nuevas áreas de formación cuando me interese aprender algo diferente.

Por ejemplo:
- Finanzas personales.
- Economía.
- Inteligencia Artificial.
- Historia.
- Psicología.
- Comunicación.
- Cultura general.
- Otras habilidades.

No quiero que estas áreas se conviertan automáticamente en hábitos.

La formación personal debe poder consultarse y analizarse de manera independiente a los hábitos y a las notas académicas.

# 4. EXTRAS Y EXPERIENCIAS PUNTUALES

Este apartado es especialmente importante.

Quiero poder registrar actividades que haya realizado por iniciativa propia, aunque no formen parte de mis hábitos ni de mis áreas habituales de aprendizaje.

Por ejemplo:
- Practicar mecanografía.
- Aprender a bailar sevillanas.
- Aprender a cocinar una receta.
- Probar un deporte nuevo.
- Hacer una excursión.
- Aprender a tocar un instrumento.
- Ver una conferencia interesante.
- Hacer una actividad cultural.
- Practicar una habilidad concreta.
- Cualquier otra experiencia que quiera recordar.

**No quiero que estas actividades se conviertan en hábitos automáticamente.**

Su funcionamiento debe ser el siguiente:

- Puedo añadir un extra en cualquier momento.
- Escribo el nombre de la actividad.
- Puedo añadir una descripción o comentario.
- Puedo indicar la fecha.
- Puedo registrar opcionalmente la duración.
- Puedo añadir una categoría, si quiero.
- Puedo guardar qué he aprendido o cómo ha ido.
- Puedo consultar todos mis extras en el historial.

Ejemplo:

Fecha: 12 de noviembre.
Actividad: Practicar mecanografía.
Duración: 20 minutos.
Comentario: He practicado precisión y velocidad.

Otro ejemplo:

Fecha: 15 de noviembre.
Actividad: Aprender a bailar sevillanas.
Duración: 45 minutos.
Comentario: He practicado los primeros pasos.

Estos registros deben considerarse **actividades adicionales**, no hábitos.

Por tanto:
- No afectan al porcentaje de hábitos diarios.
- No cuentan como hábitos completados.
- No generan rachas de hábitos.
- No penalizan si no realizo ningún extra.
- No tienen una frecuencia obligatoria.
- No se consideran incumplidos si paso varios días sin registrar ninguno.

Sí quiero que puedan aparecer en mi historial y en un apartado de estadísticas de actividades adicionales, por ejemplo, número de extras realizados, categorías más frecuentes y tiempo dedicado cuando lo haya registrado.

También quiero poder editar y eliminar estos registros.

# 5. ESTUDIOS ACADÉMICOS — 2.º DE BACHILLERATO

Este apartado debe estar completamente separado de la formación personal.

Aquí quiero registrar exclusivamente mis notas académicas.

No quiero registrar deberes, ejercicios, trabajos, tareas ni tiempo de estudio.

Solo quiero llevar un control de:
- Notas de exámenes.
- Notas de evaluaciones trimestrales.

## Asignaturas

Quiero poder crear, editar y eliminar asignaturas.

Cada asignatura tendrá su propio historial de notas.

Es fundamental que Matemáticas e Inglés estén diferenciadas en dos ámbitos:

- Matemáticas — preparación personal.
- Matemáticas — 2.º de Bachillerato.
- Inglés — formación personal.
- Inglés — 2.º de Bachillerato.

Nunca deben mezclarse sus registros, estadísticas, objetivos ni resultados.

## Registro de notas

Cada registro debe incluir:
- Asignatura.
- Tipo de nota: examen o evaluación trimestral.
- Fecha.
- Nota obtenida.
- Nota máxima, establecida por defecto en 10.
- Comentario opcional.

Debe permitirme editar o eliminar cualquier nota.

## Estadísticas académicas

Quiero consultar:
- Media general.
- Media por asignatura.
- Número de exámenes registrados.
- Evolución de las notas.
- Comparación entre trimestres.
- Mejor y peor nota.
- Gráficas de evolución por asignatura.
- Diferencia entre notas de exámenes y evaluaciones.

Las notas deben normalizarse cuando se utilicen escalas diferentes.

No se deben inventar notas ni considerar como cero las notas que todavía no haya registrado.

Las estadísticas deben calcularse únicamente a partir de los datos reales disponibles.

# 6. ESTADO DE ÁNIMO Y REFLEXIÓN DIARIA

Quiero poder valorar cómo me ha ido el día mediante cinco opciones:

- Muy mal.
- Mal.
- Normal.
- Bien.
- Muy bien.

Puede representarse mediante cinco caras o emojis.

Este registro es completamente opcional y puedo modificarlo posteriormente.

También quiero un espacio para escribir comentarios sobre el día:
- Qué ha ocurrido.
- Qué he aprendido.
- Qué me ha preocupado.
- Qué quiero mejorar.
- Cualquier otra reflexión.

Debe guardarse automáticamente y no requerir que escriba algo todos los días.

# 7. CITA O CURIOSIDAD DEL DÍA

Quiero que cada día aparezca una cita interesante o un dato curioso.

Puede tratarse de:
- Filosofía.
- Ciencia.
- Historia.
- Psicología.
- Tecnología.
- Inteligencia Artificial.
- Economía.
- Literatura.
- Naturaleza.
- Cultura general.

Si es una cita, quiero que aparezca el autor.

Si es un dato curioso, quiero que sea fiable y, cuando sea posible, incluya una fuente consultable.

No quiero atribuciones inventadas ni datos falsos.

Debe evitarse repetir constantemente el mismo contenido.

Quiero poder guardar mis citas o curiosidades favoritas y consultar las anteriores.

Si la aplicación necesita conexión para actualizar este contenido, debe seguir mostrando contenido previamente guardado cuando esté sin conexión.

# 8. OBJETIVOS A LARGO PLAZO

Quiero un apartado independiente para registrar objetivos personales.

No deben confundirse con los hábitos diarios.

Ejemplos:
- Correr los 400 metros en menos de 55 segundos.
- Aprender Python.
- Prepararme para una carrera universitaria relacionada con IA o Ciencia de Datos.
- Mejorar mi nivel de inglés.
- Ahorrar una determinada cantidad de dinero.
- Conseguir un determinado resultado académico.

Cada objetivo puede incluir:
- Nombre.
- Descripción.
- Fecha de creación.
- Fecha objetivo, opcional.
- Estado: pendiente, en progreso, conseguido o abandonado.
- Indicadores de progreso, cuando tenga sentido.
- Comentarios y actualizaciones.

Quiero poder relacionar un objetivo con hábitos o áreas de formación, pero sin que se mezclen sus estadísticas.

Por ejemplo, el objetivo de aprender Python puede estar relacionado con el área de formación personal de programación y con el hábito de aprender Python.

# 9. HISTORIAL Y CALENDARIO

Quiero un calendario donde pueda consultar mi actividad diaria.

Al seleccionar un día, debe poder consultar:
- Hábitos completados.
- Hábitos pendientes.
- Hábitos excluidos.
- Extras realizados.
- Formación personal registrada.
- Estado de ánimo.
- Comentarios.
- Información adicional que haya introducido.

Los días sin información deben aparecer como días sin datos, no como días incumplidos.

El historial comenzará en la fecha en la que instale o empiece a utilizar la aplicación.

No quiero que se inventen registros anteriores ni que se rellenen días pasados automáticamente.

Debe poder editar los registros de días anteriores.

# 10. ESTADÍSTICAS GENERALES

Quiero estadísticas útiles y basadas exclusivamente en información real.

## Hábitos
- Porcentaje de cumplimiento general.
- Hábitos más constantes.
- Hábitos menos constantes.
- Total de hábitos completados.
- Días perfectos.
- Racha actual.
- Mejor racha.
- Evolución por periodos.

## Formación personal
- Tiempo dedicado, cuando se haya registrado.
- Sesiones realizadas.
- Evolución por área.
- Temas trabajados.
- Actividad a lo largo del tiempo.

## Extras
- Total de actividades adicionales.
- Categorías más frecuentes.
- Tiempo dedicado, cuando esté disponible.
- Historial de experiencias.

## Estado de ánimo
- Distribución de valoraciones.
- Evolución a lo largo del tiempo.
- Posibles patrones descriptivos entre hábitos y estado de ánimo.

No se deben afirmar relaciones causales ni hacer diagnósticos a partir de estos datos.

## Periodos

Quiero poder consultar estadísticas de:
- Últimos 7 días.
- Últimos 30 días.
- Últimos 90 días.
- Últimos 365 días.
- Todo el historial.
- Periodo personalizado.

# 11. HÁBITOS FLEXIBLES Y PERSONALIZABLES

Quiero poder modificar mi sistema conforme cambien mis objetivos.

Debe ser posible:
- Añadir hábitos.
- Eliminar hábitos.
- Pausar hábitos.
- Archivarlos.
- Cambiar sus nombres.
- Modificar objetivos.
- Cambiar frecuencias.
- Establecer días concretos.
- Crear hábitos temporales.
- Recuperar hábitos archivados.

También quiero poder establecer hábitos semanales, por ejemplo, practicar una actividad tres veces por semana, sin tener que hacerla obligatoriamente todos los días.

No quiero que la aplicación me penalice por tener días de descanso.

# 12. COPIAS DE SEGURIDAD Y PROTECCIÓN DE DATOS

La información que registre es importante.

Quiero:
- Almacenamiento persistente.
- Exportación de todos mis datos.
- Importación de copias de seguridad.
- Posibilidad de recuperar mis datos.
- Protección frente a pérdidas accidentales.
- Confirmación antes de eliminar información importante.

No quiero anuncios, suscripciones, pagos ni cuentas innecesarias.

## Sincronización con iCloud

Mi preferencia es que los datos puedan sincronizarse mediante iCloud entre mis dispositivos Apple, si técnicamente es viable.

Investiga esta posibilidad antes de elegir la arquitectura.

Es importante no afirmar que existe sincronización con iCloud si realmente no está implementada.

Ten en cuenta que una aplicación web progresiva (PWA) no dispone automáticamente de acceso a CloudKit como una aplicación nativa.

Si iCloud no es viable con la arquitectura elegida, explica las limitaciones y propón alternativas antes de sustituirlo silenciosamente por otro servicio.

No quiero depender de un servicio de pago ni de una infraestructura innecesariamente compleja.

# 13. FUNCIONAMIENTO TÉCNICO

Quiero una aplicación web funcional que pueda utilizar desde:
- Mac.
- iPhone.

Debe ser adaptable a ambos dispositivos y permitir instalarla como aplicación si la arquitectura elegida lo permite.

Prioridades técnicas:
- Código organizado.
- Datos persistentes.
- Buen rendimiento.
- Seguridad.
- Facilidad de mantenimiento.
- Posibilidad de ampliar funcionalidades.
- Copias de seguridad.
- Compatibilidad con los dispositivos indicados.

No quiero una demostración estática ni una interfaz que parezca funcional pero cuyos botones no hagan nada.

Todos los elementos interactivos deben funcionar realmente.

# 14. CONFIGURACIÓN

Quiero una sección de configuración desde la que pueda gestionar:
- Hábitos.
- Áreas de formación.
- Asignaturas.
- Objetivos.
- Categorías de extras.
- Preferencias de seguimiento.
- Copias de seguridad.
- Datos personales de la aplicación.

Los elementos deben poder editarse sin tener que modificar el código fuente.

# 15. REGLAS FUNDAMENTALES

Estas reglas son especialmente importantes:

1. No mezclar nunca las matemáticas personales con Matemáticas de 2.º de Bachillerato.
2. No mezclar nunca el inglés personal con Inglés de 2.º de Bachillerato.
3. No mezclar notas académicas con hábitos.
4. No convertir los extras en hábitos automáticamente.
5. Los extras no afectan al porcentaje de cumplimiento ni a las rachas.
6. No inventar datos, notas, actividades ni registros anteriores.
7. No considerar los días sin información como días incumplidos.
8. No obligarme a introducir cantidades, minutos o comentarios.
9. Permitir modificar registros anteriores.
10. Permitir excluir manualmente hábitos en días concretos.
11. Mantener separadas las estadísticas de cada ámbito.
12. No añadir obligaciones innecesarias.
13. Priorizar la facilidad de registro y la utilidad real.

# 16. COMPROBACIONES ANTES DE DAR EL PROYECTO POR TERMINADO

Comprueba que:

- Puedo completar un hábito sin introducir datos adicionales.
- Puedo excluir un hábito de un día.
- Los hábitos excluidos no afectan al porcentaje.
- Puedo registrar una sesión de Python.
- Puedo registrar matemáticas personales sin que aparezca en Matemáticas de Bachillerato.
- Puedo registrar inglés personal sin que aparezca en Inglés de Bachillerato.
- Puedo introducir una nota de un examen.
- Puedo introducir una nota trimestral.
- Las medias se calculan correctamente.
- Puedo registrar un extra como practicar mecanografía.
- Puedo registrar otro extra como aprender sevillanas.
- Ninguno de esos extras se convierte en un hábito.
- Los extras no alteran las estadísticas de hábitos.
- Puedo consultar los extras en el calendario.
- Puedo registrar mi estado de ánimo.
- Puedo escribir comentarios.
- Puedo consultar mi historial.
- Puedo editar registros anteriores.
- Los datos permanecen guardados después de cerrar la aplicación.
- La exportación e importación de datos funcionan.
- No hay botones decorativos sin funcionalidad.

# 17. FILOSOFÍA DEL PROYECTO

Quiero que 27 sea una herramienta que me ayude a mejorar sin convertirse en una fuente de presión.

Debe permitirme observar mi evolución, detectar en qué estoy progresando, identificar qué aspectos descuido y descubrir nuevas cosas que me interesen.

No quiero que todo tenga que convertirse en una rutina.

Algunas cosas serán hábitos que mantengo; otras serán conocimientos que desarrollo poco a poco; otras serán resultados académicos y otras serán experiencias puntuales que me apetezca recordar.

La aplicación debe respetar esas diferencias.

**El objetivo de 27 es ayudarme a construir una vida más completa, aprender constantemente y tener constancia, sin obligarme a convertir cada actividad que disfruto en una obligación.**
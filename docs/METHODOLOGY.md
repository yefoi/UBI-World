# UBI World — Metodología

**En una frase:** miramos cuánto costaría pagar una renta básica universal en cada país y lo comparamos con el gasto que ya existe, los impuestos nuevos que cabrían y la producción extra que podría aportar la IA. Si falta dinero, decimos cuánta IA extra haría falta.

No es una predicción ni una propuesta política. Es una calculadora de supuestos: al mover los ajustes cambian los resultados. La web tiene un **modo Sencillo** (dos sliders y una frase con cifras) y un **modo Completo** (todos los parámetros y las fórmulas).

## 1. Datos

Se descargan de la API del Banco Mundial con `npm run fetch-data` y se guardan en `src/data/countries.json`. La app no llama a ninguna API en tiempo de ejecución.

| Indicador | Código |
|---|---|
| PIB (US$ corrientes) | `NY.GDP.MKTP.CD` |
| Población total | `SP.POP.TOTL` |
| Población 0-14 (%) | `SP.POP.0014.TO.ZS` |
| PIB per cápita PPA (US$) | `NY.GDP.PCAP.PP.CD` |
| Ingresos fiscales (% del PIB) | `GC.TAX.TOTL.GD.ZS` |
| Gasto público (% del PIB) | `GC.XPN.TOTL.GD.ZS` |

Para cada indicador se toma el **último año disponible de los últimos cinco** y se guarda ese año. Si falta alguno de los seis, el país aparece en gris y **no se inventa ni se rellena**. El script descarta valores imposibles (PIB o población ≤ 0, porcentajes fuera de 0–100, importes negativos). Los años pueden no coincidir entre indicadores; el panel avisa si hay un desfase de 3 años o más.

## 2. Unidades: nada de mezclar PPA con nominal

El PIB en PPA se calcula como:

```
PIB PPA = PIB per cápita PPA × población
```

Todos los porcentajes del modelo se calculan en PPA. Para mostrar importes en dólares corrientes se aplica el deflactor implícito:

```
deflactor = PIB nominal / PIB PPA
importe corriente = importe PPA × deflactor
```

Así, el coste en % del PIB es el mismo tanto si se calcula en PPA como si se convierte a nominal con el mismo deflactor. Lo que no se hace es dividir un importe PPA entre un PIB nominal.

## 3. Cálculo

### 3.1 Cuantía y cobertura

- **% del PIB per cápita PPA**: importe adulto = PIB per cápita PPA × porcentaje.
- **US$/mes PPA**: importe adulto = importe mensual × 12.
- Menores: importe menor = importe adulto × `childShare` (50% por defecto).
- Cobertura: solo adultos (15 años o más) o adultos + menores.

### 3.2 Coste bruto

```
coste bruto PPA = adultos × importe adulto + menores × importe menor
coste bruto % PIB = coste bruto PPA / PIB PPA × 100
coste bruto nominal = coste bruto % PIB × PIB nominal
```

### 3.3 Gasto público redirigido

El control **no** descuenta un porcentaje del coste del UBI. Indica qué parte del gasto público actual se cambiaría por el UBI:

```
gasto redirigido = mínimo(coste bruto, gasto público × % de reaprovechamiento)
coste neto = coste bruto − gasto redirigido
```

El límite `mínimo(coste bruto, …)` evita redirigir más dinero del que cuesta el UBI. Los datos del Banco Mundial son agregados: la app **no identifica programas concretos** (sanidad, pensiones, ayudas…). El supuesto es que una parte del gasto total es sustituible; en la realidad habría que decidir cuáles.

### 3.4 Impuestos nuevos (recaudación adicional)

La recaudación actual **no** se trata como dinero disponible: ya financia otros gastos. Lo que se modela es el espacio adicional hasta un techo de presión fiscal:

```
impuestos nuevos = máximo(0, techo fiscal − ingresos fiscales actuales)
```

Si el techo se sube del 50% al 70%, el margen aumenta. Si la recaudación actual ya supera el techo, el margen es 0. Es una simplificación: los ingresos fiscales del Banco Mundial no incluyen todas las cotizaciones sociales, así que el margen puede quedar corto o largo según el país.

### 3.5 Ingreso atribuible a la IA

```
ingreso IA = crecimiento extra del PIB × % producción doméstica × % captado por el Estado
```

Los tres parámetros son escenarios hipotéticos, no previsiones. Si el crecimiento es negativo, el ingreso es 0. Si la captación o la propiedad doméstica son 0, el ingreso es 0.

### 3.6 Brecha

```
brecha = coste neto − impuestos nuevos − ingreso IA
```

- `brecha ≤ 0`: con esos supuestos, las cuentas salen (puede sobrar dinero).
- `brecha > 0`: falta esa parte del PIB.

### 3.7 Crecimiento por IA necesario

```
IA necesaria = brecha / (% doméstico × % captado)
```

Si el denominador es 0 y la brecha es positiva, el resultado es infinito: esa vía no puede cerrar la diferencia. Si la brecha es ≤ 0, la IA necesaria es 0.

## 4. Categorías

| Categoría | Regla |
|---|---|
| Se podría pagar hoy | brecha ≤ 0 sin crecimiento extra por IA |
| Faltaría poco o lo cubre la IA | brecha ≤ 0 con la IA incluida, o IA necesaria < 5% del PIB |
| Haría falta mucha IA | IA necesaria entre 5% y 15% del PIB |
| No cuadra ni con mucha IA | IA necesaria ≥ 15% del PIB, o captación 0 con brecha |
| Sin datos suficientes | falta alguno de los seis indicadores |

Los cortes del 5% y el 15% son convenciones de esta herramienta, no resultados empíricos.

## 5. Colores y texturas del mapa

- **Categoría:** verde (se paga hoy), verde lima (faltaría poco), ámbar (mucha IA), rojo (no cuadra), gris (sin datos).
- **Brecha:** verde si no falta nada; lima hasta 3 de cada 100; ámbar hasta 8; naranja hasta 20; rojo por encima.
- **Coste neto:** verde por debajo de 5 de cada 100; lima hasta 10; ámbar hasta 20; naranja hasta 35; rojo por encima.
- **IA necesaria:** verde si no hace falta; lima hasta 5; ámbar hasta 15; naranja hasta 30; rojo por encima o imposible.

Cada color lleva además una textura (líneas o puntos) y la leyenda escribe qué significa. La información no depende solo del color.

## 6. Frase-resumen

Para cada país se genera una frase con cifras redondeadas, por ejemplo:

> De cada 100 $ que produce el país en un año, pagar el UBI costaría unos 27 $. Ese dinero podría salir de 6 $ de gasto que ya existe, 30 $ de impuestos nuevos y 0 $ de la IA. Y no faltaría nada: sobrarían 9 $ de cada 100.

Los redondeos pueden hacer que las partes no sumen exactamente 100. La frase se recalcula con los sliders.

## 7. Limitaciones

- **Gasto sustituible agregado:** no se identifican programas concretos ni rigideces políticas.
- **Impuestos:** el indicador del Banco Mundial excluye parte de las cotizaciones sociales; el margen fiscal es aproximado.
- **Sin comportamiento:** no modela evasión, informalidad, deuda, inflación, tipos de cambio, incidencia ni cambios de conducta.
- **PPA aproximada:** el PIB per cápita PPA no es un índice de precios de consumo; se usa como deflactor aproximado.
- **Promedios nacionales:** no dicen nada sobre la distribución dentro del país.
- **IA especulativa:** crecimiento, propiedad doméstica y captación son escenarios.
- **Datos incompletos:** algunos países no tienen los seis indicadores y quedan en gris.
- **No es asesoría:** no afirma obligaciones legales ni viabilidad real.

## 8. Glosario

La web incluye un glosario accesible desde la cabecera y ayudas `?` junto a los controles. Cada término tiene una explicación de una frase y un ejemplo cotidiano. El mismo contenido está en `src/i18n/glossary.ts`.

## 9. Reproducir

```bash
npm install
npm run fetch-data   # regenera src/data/countries.json
npm test             # modelo, resumen, URL y helpers
npm run build
```

Los datos generados se commitean. La app es estática y no necesita backend.

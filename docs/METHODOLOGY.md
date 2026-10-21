# UBI World - Metodología

**IMPORTANTE**: Esta es una herramienta divulgativa. NO es una predicción, sino un ejercicio hipotético: *"¿Qué tendría que pasar para que cuadre?"*

## Objetivo
Responder de forma clara en 30 segundos qué tendría que pasar para financiar una Renta Básica Universal (UBI) en cada país en un escenario de abundancia por IA.

## Supuestos

### Datos (Banco Mundial)
Los datos se descargan con `scripts/fetch-data.ts` de la API del Banco Mundial:
- PIB (US$ corrientes) - `NY.GDP.MKTP.CD`
- Población total - `SP.POP.TOTL`
- % población 0-14 años - `SP.POP.0014.TO.ZS`
- PIB per cápita PPA (US$ actuales) - `NY.GDP.PCAP.PP.CD`
- Ingresos fiscales (% del PIB) - `GC.TAX.TOTL.GD.ZS`
- Gasto público (% del PIB) - `GC.XPN.TOTL.GD.ZS`

Para cada indicador se toma el **último año disponible de los últimos 5 años** y se guarda ese año.  
**Si falta algún dato imprescindible, el país se marca como Sin datos (gris). NUNCA se inventa ni rellena.**

### Cálculo de UBI

#### Cuantía
Dos formas:
1. **% del PIB per cápita PPA**: `ubi_usd_mes = (pib_pc_ppa * pct_pib_pc_ppa / 100) / 12`
2. **US$/mes PPA**: valor directo

#### Cobertura
- **Solo adultos**: población >= 15 años = `poblacion_total * (1 - pop_0_14/100)`
- **Adultos + menores**: todos. Los menores reciben el **50%** de la cuantía de adultos.

#### Coste bruto
```
coste_bruto_usd = (adultos * ubi_adulto) + (menores * ubi_menor)
coste_bruto_pct_pib = (coste_bruto_usd / pib_total_usd) * 100
```

#### Gasto público que sustituye
El parámetro `% del gasto público actual que el UBI sustituye` representa transferencias/programas existentes que podrían fusionarse.  
**Coste neto** = `coste_bruto * (1 - pct_gasto_sustituido / 100)`

### Margen fiscal actual
El espacio fiscal disponible hoy (sin crecimiento por IA) se aproxima como:
```
margen_fiscal_actual_pct_pib = ingresos_fiscales_pct_pib
```
Se aplica un **techo de presión fiscal configurable** (por defecto **50% del PIB**). Si los ingresos fiscales ya superaran teóricamente el techo (muy poco común), se limita.  
Este es un **aproximado simplificado**: no considera deuda, rigideces presupuestarias, etc.

### Ingreso captado por IA
En un escenario con crecimiento adicional por IA `g` (% del PIB):
```
produccion_extra_pib = pib_total_usd * (g / 100)
produccion_extra_domestica = produccion_extra_pib * (pct_domestico_ia / 100)
ingreso_captado_estado = produccion_extra_domestica * (pct_captado_estado / 100)
ingreso_captado_pct_pib = (ingreso_captado_estado / pib_total_usd) * 100
```

Donde:
- `g` = crecimiento adicional del PIB por IA
- `% de esa producción extra que capta el Estado` = impuesto/fondo soberano sobre lo generado
- `% de esa producción que queda en el país (propiedad doméstica de la IA)` = cuánto de la producción extra se considera doméstica

### Brecha
```
brecha_pct_pib = coste_neto_pct_pib - margen_fiscal_actual_pct_pib - ingreso_captado_pct_pib
```
- Si `brecha <= 0`: teóricamente cubierto con los supuestos dados
- Si `brecha > 0`: falta cubrir esa diferencia

### Crecimiento por IA necesario
Dado el resto de parámetros, ¿cuánto crecimiento adicional por IA `g_necesario` haría falta para cerrar la brecha?
```
Se resuelve: ingreso_captado_pct_pib(g) >= brecha_pct_pib_actual
g_necesario = (brecha_pct_pib / (pct_domestico_ia/100 * pct_captado_estado/100)) * 100
```
Si ya es viable con `g=0`, `g_necesario = 0`.  
Si los factores de captación son 0 y hay brecha, el resultado es **infinito/inviable**.

### Categorías
- **Viable hoy**: `brecha <= 0` con `g = 0` (o crecimiento por IA cero)
- **Viable con IA moderada**: requiere `g_necesario` pequeño/moderado (umbral a definir en implementación, pero objetivo: razonable)
- **Requiere IA extrema**: requiere `g_necesario` muy alto
- **Inviable**: matemáticamente inviable con los supuestos (factores de captación insuficientes/imposibles)
- **Sin datos**: faltan datos imprescindibles para calcular

## Limitaciones
- **Simplificado**: no modela inflación, tipo de cambio real, distribución, informalidad, deuda, etc.
- **Aproximado**: margen fiscal = ingresos fiscales actuales (simplificación fuerte).
- **Sustitución**: el % del gasto público sustituido es un parámetro hipotético.
- **IA**: los parámetros sobre propiedad/captación son puramente hipotéticos.
- **PPA**: se usa PIB per cápita PPA para la cuantía, pero el coste se calcula en US$ corrientes.
- **No es asesoría**: refleja el texto/lógica, no afirma obligaciones legales.
- **Divulgativo**: para generar debate, no para predecir el futuro.

## Filosofía
*"¿Qué tendría que pasar para que cuadre?"* - no *"¿va a pasar?"*.

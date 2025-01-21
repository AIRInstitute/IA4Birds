import cron from 'node-cron';
import axios from 'axios';
import redis from './redis.config';
import globalConfig from './global.config';

// Definición de la interfaz de los datos de DataBird
interface DataBird {
    recordings: any[];
}

// Función para determinar si hoy es el último día del mes
function isLastDayOfMonth(): boolean {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.getDate() === 1;
}

// Programar dataBird para ejecutarse una vez al mes cuando sea el último día del mes, ya sea 28, 29, 30 o 31
cron.schedule('0 0 * * *', async () => {
    if (isLastDayOfMonth()) {
        try {
            const response = await axios.get<DataBird>(`${globalConfig.pythonURL}/dataBird`);
            const dataBirdData = response.data;

            await redis.set('dataBirdKey', JSON.stringify(dataBirdData));
            console.log('Datos de dataBird actualizados en Redis');
        } catch (error) {
            console.error('Error actualizando datos de dataBird desde el servicio Python', error);
        }
    }
});


// // Función para actualizar DataBird en Redis con una clave específica para diferenciarlos
// async function updateDataBird(keySuffix: string): Promise<void> {
//     if (isLastDayOfMonth()) {
//         try {
//             const response = await axios.get<DataBird>(`${globalConfig.pythonURL}/dataBird`);
//             const dataBirdData = response.data;

//             const redisKey = `dataBirdKey${keySuffix}`;
//             await redis.set(redisKey, JSON.stringify(dataBirdData));
//             console.log(`Datos de dataBird actualizados en Redis con clave: ${redisKey}`);
//         } catch (error) {
//             console.error(`Error actualizando datos de dataBird (${keySuffix}) desde el servicio Python`, error);
//         }
//     }
// }

// // Cron para ejecutar cada 3 meses (en los meses 2, 5, 8, 11)
// cron.schedule('0 0 28 2,5,8,11 *', async () => {
//     console.log('Ejecutando tarea cada 3 meses');
//     await updateDataBird('3Months');
// });

// // Cron para ejecutar cada 6 meses (en los meses 6 y 12)
// cron.schedule('0 0 28 6,12 *', async () => {
//     console.log('Ejecutando tarea cada 6 meses');
//     await updateDataBird('6Months');
// });

// // Cron para ejecutar cada 12 meses (en el mes 12)
// cron.schedule('0 0 28 12 *', async () => {
//     console.log('Ejecutando tarea cada 12 meses');
//     await updateDataBird('12Months');
// });

import cron from 'node-cron';

export const startScheduler = () => {
    console.log('Schduled tasks started...');

    cron.schedule('* * * * *', () => {
        const now = new Date().toISOString();
        console.log(`[Penjadwal Tugas] Menjalankan pemeliharaan latar belakang pada ${now}...`);
    });
};

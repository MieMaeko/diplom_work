import { Connection } from 'typeorm';

export async function checkDatabaseConnection(connection: Connection): Promise<void> {
  try {
    await connection.query('SELECT 1');
    console.log('Подключение к базе данных успешно!');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    throw error;
  }
}
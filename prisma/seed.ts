import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import fs from 'fs';
import cryptr from "../utils/cryptr";
const prisma = new PrismaClient();
const createRandomUser = () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
}
const createRandomMovie = () => {
    return {
        name: faker.music.songName(),
        show_time: faker.date.future(),
        seat_available: Math.random() * 50
    }
}
const writeDataToFile = async (content: string) => {
    try {
        await fs.promises.writeFile('seed-data.json', content, { flag: 'w' })
    } catch (error) {
        console.log('Failed to write seed data into file');
    }
}
const main = async () => {
    let content: Array<any> = [];
    const users = faker.helpers.multiple(createRandomUser, {
        count: 5
    });
    for (const user of users){
        const db_user = await prisma.user.create({
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                hash_password: cryptr.encrypt(user.password)
            }
        });
        content.push({...db_user, password:user.password})
    }

    const movies = faker.helpers.multiple(createRandomMovie, {
        count: 5
    });
    content.push("*************************************** Movies *************************")
    for (const movie of movies) {
        const new_movies = await prisma.movie.create({
            data: movie
        })
        content.push(new_movies);
    }
    await writeDataToFile(JSON.stringify(content));

};
main().then(() => console.log('Seeding Success')).catch(err => console.log('Seeding failed: ', err)).finally(async () => {
    await prisma.$disconnect();
    process.exit(1);
})
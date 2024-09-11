import { Global, Module } from "@nestjs/common";
import { DataSource } from "typeorm";

@Global() // makes the module available globally for other modules once imported in the app modules
@Module({
    imports: [],
    providers: [
        {
            provide: DataSource, // add the datasource as a provider
            inject: [],
            useFactory: async () => {
                // using the factory function to create the datasource instance
                try {
                    const datasource = new DataSource({
                        type: 'postgres',
                        host: 'localhost',
                        port: 5432,
                        username: 'postgres',
                        password: 'root',
                        database: 'simple-crm_db',
                        synchronize: true,
                        entities: [`${__dirname}/../**/**.entity{.ts,.js}`], // this will automatically load all entity file in the src folder
                    });
                    await datasource.initialize(); // initialize the data source
                    console.log('Database connected successfully');
                    return datasource;
                } catch (error) {
                    console.log('Error connecting to database');
                    throw error;
                }
            }
        }
    ],
    exports: [DataSource],
})
export class TypeOrmModule {}
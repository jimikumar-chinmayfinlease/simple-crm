import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from './users.entity';
import { DataSourceService, UsernameQuery } from 'src/datasource/datasource.service';

export interface CreateUser {
    username: string;
    password: string;
}

@Injectable()
export class UsersService {
    private userRepository;
    private customUserRepository;
    private logger = new Logger();
    // inject the Datasource provider
    constructor(
        private datasource: DataSource,
        private dataSourceService: DataSourceService, // inject our datasource service
    ) {
        // get users table repository to interact with the database
        this.userRepository = this.datasource.getRepository(UserEntity);
        // assigning the dataSourceService userCustomRepository to the class customUserRepository
        this.customUserRepository = this.dataSourceService.userCustomRepository;
    }
    // create handler to create new user an save to the database
    async createUser(createUser: CreateUser): Promise<UserEntity> {
        try {
            const user = await this.userRepository.create(createUser);
            return await this.userRepository.save(user);
        } catch (error) {
            if (error.code == 23505) {
                this.logger.error(error.message, error.stack);
                throw new HttpException('Username already exists', HttpStatus.CONFLICT);
            }
            this.logger.error(error.message, error.stack);
            throw new InternalServerErrorException(
                'Something went wrong, Try again!',
            );
        }
    }
    // the userService filterByUsername handler
    async filterByUsername(usernameQuery: UsernameQuery): Promise<UserEntity[]> {
        try {
            // calling the customUserRepository filterUser custom method
            return await this.customUserRepository.filterUser(usernameQuery);
        } catch (error) {
            this.logger.error(error.message, error.stack);
            throw new InternalServerErrorException(
                'Something went wrong, Try again!',
            );
        }
    }
}

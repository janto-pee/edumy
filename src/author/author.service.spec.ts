import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthorService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Author.name),
          useValue: Author,
        },
        AuthorService,
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

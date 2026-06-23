import 'reflect-metadata';

process.env.DATABASE_URL ||= 'postgresql://docker:docker@localhost:5432/nest';
process.env.JWT_PRIVATE_KEY ||= Buffer.from('test-private-key').toString('base64');
process.env.JWT_PUBLIC_KEY ||= Buffer.from('test-public-key').toString('base64');
process.env.PORT ||= '3333';

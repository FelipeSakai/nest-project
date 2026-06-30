import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    oxc: false,
    plugins: [
        swc.vite({
            module: {
                type: 'es6',
            },
            jsc: {
                target: 'es2023',
                parser: {
                    syntax: 'typescript',
                    decorators: true,
                },
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
            },
        }),
    ],
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./test/vitest.setup.ts'],
        globalSetup: './test/vitest.global-setup.ts',
        include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
        hookTimeout: 60000,
    },
});

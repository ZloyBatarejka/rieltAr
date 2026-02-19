import { generateApi } from 'swagger-typescript-api';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

const projectRoot: string = join(__dirname, '..');
const swaggerPath: string = join(projectRoot, '..', 'swagger', 'swagger.json');
const outputPath: string = join(projectRoot, 'src', 'api', 'generated');

async function generateClient(): Promise<void> {
    try {
        await generateApi({
            input: swaggerPath,
            output: outputPath,
            fileName: 'Api.ts',

            httpClientType: 'axios',

            generateClient: true,
            generateRouteTypes: true,
            generateResponses: true,

            extractRequestParams: true,
            extractEnums: true,

            unwrapResponseData: true,
            generateUnionEnums: true,

            moduleNameFirstTag: true,
            singleHttpClient: true,

            cleanOutput: true,

        });

        console.log('✅ API client generated successfully!');
        console.log(`📁 Output: ${outputPath}`);
    } catch (error: unknown) {
        console.error('❌ Error generating API client:', error);
        process.exit(1);
    }
}

void generateClient();

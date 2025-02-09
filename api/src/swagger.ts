import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const route = Router();

const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));

route.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default route;
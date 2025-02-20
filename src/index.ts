//import elysia
import { Elysia, t } from 'elysia';


//import routes
import Routes from './routes';

//initiate elysia
const app = new Elysia();

//route home
app.get('/', () => 'Hello Elysia!');
app.get(
  "/api/image/:name", 
  ({ params: { name } }) => Bun.file(`uploads/${name}`),
  {
    params: t.Object({
      name: t.String()
    })
  }
)
//add routes
app.group('/api', (app) => app.use(Routes))

//start server on port 3000
app.listen(3000);
 
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
## Development Steps
### Env required
```
DATABASE_URL='postgresql://test:test@postgres:5432/test?schema=public'
S3_BUCKET_IAM_ACCESS_KEY_ID=
S3_BUCKET_IAM_SECRET_KEY_ID=
S3_BUCKET_NAME=
S3_BUCKET_REGION=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
JWT_SECRET='thisisecret'
SALT_SECRET='thisissecret'
```
1. cd into project
2. ``` yarn install ```
3. ``` npx primsa generate ```
4. ``` npx prisma migrate dev ```
5. ``` yarn run seed```
7. ``` yarn run dev ```
6. ``` cd ./web && yarn run build ```
8. Access by going to http://localhost:5000

### Running via Docker Image
```
docker run -e DATABASE_URL="" -e S3_BUCKET_IAM_ACCESS_KEY_ID="" -e S3_BUCKET_IAM_SECRET_KEY_ID="" -e S3_BUCKET_NAME="" -e JWT_SECRET="" -e S3_BUCKET_REGION="" -d -p 80:5000 rakeshdhariwal657/grouple 
```

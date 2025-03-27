FROM node:latest

# กำหนด Working directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# คัดลอกซอร์สโค้ดทั้งหมด
COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
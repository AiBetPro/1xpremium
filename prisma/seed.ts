import {PrismaClient} from '@prisma/client';
const prisma=new PrismaClient();

async function main(){
  await prisma.user.upsert({
    where:{id:'demo-user'},
    update:{},
    create:{
      id:'demo-user',
      email:'demo@goalix.local',
      passwordHash:'DEMO_ONLY',
      balance:10000,
      currency:'XOF'
    }
  });
}

main().finally(()=>prisma.$disconnect());
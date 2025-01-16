const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



async function main() {
  const employees = [
    { name: 'John Doe' },
    { name: 'Jane Smith' },
    { name: 'Alice Johnson' },
    { name: 'Bob Brown' },
    { name: 'Charlie Davis' },
    { name: 'David Evans' },
    { name: 'Emily Garcia' },
    { name: 'Frank Harris' },
    { name: 'Grace Miller' },
    { name: 'Henry Wilson' }
  ];

  // Loop through the array of employees and create them
  for (let employee of employees) {
    await prisma.employee.create({
      data: employee,
    });
  }

  console.log('10 employees seeded successfully!');
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const allEmployees = await prisma.employee.findMany();
console.log(allEmployees);

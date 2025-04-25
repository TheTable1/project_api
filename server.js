const Hapi = require("@hapi/hapi");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const server = Hapi.server({
  port: 4000,
  host: "localhost",
  routes: {
    cors: {
      origin: ["*"], 
    },
  },
});

const init = async () => {
  // GET /project
  server.route({
    method: "GET",
    path: "/project",
    handler: async (request, h) => {
      try {
        const projects = await prisma.project.findMany();
        return h.response(projects).code(200);
      } catch (error) {
        console.error(error);
        return h
          .response({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรเจกต์ทั้งหมด" })
          .code(500);
      }
    },
  });

  
  // GET /project/{pId}
  server.route({
    method: "GET",
    path: "/project/{pId}",
    handler: async (request, h) => {
      const { pId } = request.params;
      try {
        const project = await prisma.project.findUnique({
          where: { pId: parseInt(pId) },
        });
        if (project) {
          return h.response(project).code(200);
        } else {
          return h.response({ error: `ไม่พบ project id: ${pId}` }).code(404);
        }
      } catch (error) {
        console.error(error);
        return h
          .response({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรเจกต์" })
          .code(500);
      }
    },
  });

  // POST /project/create
  server.route({
    method: "POST",
    path: "/project/create",
    handler: async (request, h) => {
      const {
        pName,
        pDateStart,
        pDateEnd,
        pDateCompleted,
        pStatus,
        pDescription,
      } = request.payload;

      try {
        const project = await prisma.project.create({
          data: {
            pName,
            pDateStart: new Date(pDateStart),
            pDateEnd: pDateEnd ? new Date(pDateEnd) : null,
            pDateCompleted: pDateCompleted ? new Date(pDateCompleted) : null,
            pStatus,
            pDescription,
          },
        });
        return h.response(project).code(201);
      } catch (error) {
        console.error(error);
        return h
          .response({ error: "เกิดข้อผิดพลาดในการสร้างโปรเจกต์" })
          .code(500);
      }
    },
  });

  // PUT /project/edit/{pId}
  server.route({
    method: "PUT",
    path: "/project/edit/{pId}",
    handler: async (request, h) => {
      const { pId } = request.params;
      const {
        pName,
        pDateStart,
        pDateEnd,
        pDateCompleted,
        pStatus,
        pDescription,
      } = request.payload;

      try {
        const project = await prisma.project.update({
          where: { pId: parseInt(pId) },
          data: {
            pName,
            pDateStart: new Date(pDateStart),
            pDateEnd: pDateEnd ? new Date(pDateEnd) : null,
            pDateCompleted: pDateCompleted ? new Date(pDateCompleted) : null,
            pStatus,
            pDescription,
          },
        });
        return h.response(project).code(200);
      } catch (error) {
        console.error(error);
        return h
          .response({ error: "เกิดข้อผิดพลาดในการแก้ไขโปรเจกต์" })
          .code(500);
      }
    },
  });

  // DELETE /project/delete/{pId}
  server.route({
    method: "DELETE",
    path: "/project/delete/{pId}",
    handler: async (request, h) => {
      const { pId } = request.params;
      try {
        await prisma.project.delete({
          where: { pId: parseInt(pId) },
        });
        return h.response({ message: "ลบโปรเจกต์เรียบร้อยแล้ว" }).code(200);
      } catch (error) {
        console.error(error);
        return h.response({ error: "เกิดข้อผิดพลาดในการลบโปรเจกต์" }).code(500);
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

// Start server
init().catch((err) => {
  console.error(err);
  process.exit(1);
});

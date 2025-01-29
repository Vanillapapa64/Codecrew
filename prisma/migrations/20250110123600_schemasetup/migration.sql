-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "githubusername" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Techstackuser" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "tech" TEXT NOT NULL,

    CONSTRAINT "Techstackuser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectDesc" TEXT NOT NULL,
    "repoLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progess" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Techstackproject" (
    "id" SERIAL NOT NULL,
    "projectid" INTEGER NOT NULL,
    "tech" TEXT NOT NULL,

    CONSTRAINT "Techstackproject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Techstackuser" ADD CONSTRAINT "Techstackuser_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Techstackproject" ADD CONSTRAINT "Techstackproject_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ email, phone, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        name,
      },
    });

    return user;
  }

  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findByPhone(phone) {
    return await prisma.user.findUnique({
      where: { phone },
    });
  }

  static async findByEmailOrPhone(email, phone) {
    if (email) {
      const user = await this.findByEmail(email);
      if (user) return user;
    }

    if (phone) {
      return await this.findByPhone(phone);
    }

    return null;
  }

  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateById(id, updates) {
    return await prisma.user.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
  }
}

export default User;

import supabase from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ email, phone, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertData = {
      password: hashedPassword,
      name
    };

    if (email) insertData.email = email;
    if (phone) insertData.phone = phone;

    const { data, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findByPhone(phone) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from('users')
      .select('id, email, phone, name, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateById(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export default User;

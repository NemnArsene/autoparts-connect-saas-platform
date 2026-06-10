import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Feature modules (stubs — to be implemented in Phase 5)
// import { AuthModule } from './auth/auth.module';
// import { PartsModule } from './parts/parts.module';
// import { ReservationsModule } from './reservations/reservations.module';
// import { SuppliersModule } from './suppliers/suppliers.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017/autoparts-connect',
    ),
    // AuthModule,
    // PartsModule,
    // ReservationsModule,
    // SuppliersModule,
    // NotificationsModule,
    // UsersModule,
  ],
})
export class AppModule {}

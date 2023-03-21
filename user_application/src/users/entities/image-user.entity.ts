import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ImageUserDocument = HydratedDocument<ImageUser>
@Schema()
export class ImageUser {

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    userImageBase64: string;
}

export const ImageUserSchema = SchemaFactory.createForClass(ImageUser)
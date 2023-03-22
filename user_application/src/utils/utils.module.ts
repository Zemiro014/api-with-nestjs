import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { UtilsService } from "./utils.service";

@Module({
    imports: [
        HttpModule
    ],
    providers: [UtilsService],
})
export class UtilsModules{}
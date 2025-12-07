import { Markup, Telegraf } from "telegraf";
import { cmd } from "./bot";
import { kazik } from "./bot/kazik";
import { connectDB } from "./db";
import dotenv from "dotenv";
import { kredit } from "./bot/kredit";
dotenv.config();

const token = process.env.BOT_TOKEN ?? ""
console.log(token);

const bot = new Telegraf(token);


bot.start((ctx) => {
    ctx.reply(
        "Привет! Выбери команду:",
        Markup.keyboard([
            ["/help", "/reg"],

        ])
            .resize()
            .oneTime()
    );
});

bot.hears("/reg", ctx => cmd.register(ctx))
bot.hears("/help", ctx => cmd.help(ctx))
bot.on("text", ctx => cmd.onAnyCmd(ctx))


bot.action("stav100", ctx => kazik.stavka(ctx, 100))
bot.action("stav300", ctx => kazik.stavka(ctx, 100))
bot.action("stav500", ctx => kazik.stavka(ctx, 500))
bot.action("stav1000", ctx => kazik.stavka(ctx, 1000))
bot.action("freeMony", ctx => kazik.freeMony(ctx, 1000))
bot.action("kreditInfo", ctx => kredit.kreditInfo(ctx))

bot.action("me", ctx => cmd.me(ctx))
bot.action("all", ctx => cmd.getAllusers(ctx))



connectDB().then(() => bot.launch());
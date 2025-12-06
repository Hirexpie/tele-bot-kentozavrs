import { Markup, Telegraf } from "telegraf";
import { BotCmd } from "./bot";
import { connectDB } from "./db";

const token = "token"

const bot = new Telegraf(token);
const cmd = new BotCmd();


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
bot.hears("/help", ctx => cmd.register(ctx))
bot.on("text", ctx => cmd.onAnyCmd(ctx))


bot.action("stav100", ctx => cmd.stav100(ctx))
bot.action("stav300", ctx => cmd.stav300(ctx))
bot.action("stav500", ctx => cmd.stav500(ctx))
bot.action("stav1000", ctx => cmd.stav1000(ctx))

bot.action("me", ctx => cmd.me(ctx))



connectDB().then(() => bot.launch());
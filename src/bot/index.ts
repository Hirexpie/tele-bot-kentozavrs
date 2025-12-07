import { Context, Markup } from "telegraf";
import { User } from "../db/entity/user";
import { kazik } from "./kazik";
import { rpg } from "./rpg";

class BotCmd {
    public async register(ctx: Context): Promise<void> {
        if (!ctx.from) {
            console.log("Нет данных о пользователе");
            await ctx.reply("Ошибка регистрации");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (user) {
            await ctx.reply("Нахуя еще раз регистрироватся?");
            return;
        }
        try {
            await User.create({
                name: ctx.from.username ?? ctx.from.first_name ?? "Unknown",
                TeleId: ctx.from.id.toString()
            });
            await ctx.reply("Регистрация прошла успешно!");
        } catch (err) {
            console.error("Ошибка при создании пользователя:", err);
            await ctx.reply("Ошибка регистрации в базе данных");
        }
    }

    public async help(ctx: Context<any>) {
        await ctx.reply(`/reg - зарегестрироватся при регистраций дается 3000 денег \nsand <sum> <username> - отправить комуто определенныю сумму \ncmd - разшыренны набор команд`)
    }

    public async onAnyCmd(ctx: Context<any>) {


        if (!ctx.from || !ctx.message?.text) {
            await ctx.reply("Ошибка отправки");
            return;
        }

        if (ctx.from.username === "bilmansur") {
            await ctx.reply(`завали ебало ${ctx.from.username}`);
        }
        const args = ctx.message.text.split(" ");

        const cmd = args[0];
        const arg1 = Number(args[1]);

        switch (cmd) {
            case "sand": await rpg.sendMony(ctx); break;
            case "cmd": await kazik.rulet(ctx); break;
            case "atk": await rpg.attak(ctx); break;
            case "dep": await kazik.stavka(ctx, arg1); break;
        }

        switch (ctx.message.text.toLowerCase()) {
            case "иди на хуй": ctx.reply("кусай за хуй"); break;
            case "иди нахуй": ctx.reply("кусай за хуй"); break;
            case "иди наху": ctx.reply("кусай за хуй"); break;
            case "пошел наху": ctx.reply("кусай за хуй"); break;
            case "пошел нахуй": ctx.reply("кусай за хуй"); break;
            case "пошел на хуй": ctx.reply("кусай за хуй"); break;
        }
    }

    public async me(ctx: Context<any>) {
        if (!ctx.from) {
            await ctx.reply("вы не зарегистрированы");
            return;
        }
        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Вы не зарегистрированы!");
            return;
        }

        await ctx.reply(`Имя: ${user.name},\nБаланс: ${user.balance},\nТелеграм Id: ${user.TeleId},\nId: ${user._id}`)
    }

    public async getAllusers(ctx: Context<any>) {
        const users = await User.find();
        let message = "пользаватели:\n";
        for (const user of users) {
            message += `${user.name};\n`
        }
        ctx.reply(message);
    }

}

export const cmd = new BotCmd();
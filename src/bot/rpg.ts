import { Context } from "telegraf";
import { User } from "../db/entity/user";

class Rpg {
    public async sendMony(ctx: Context<any>): Promise<void> {

        if (!ctx.from || !ctx.message?.text) {
            await ctx.reply("Ошибка отправки");
            return;
        }


        const args = ctx.message.text.split(" ");
        if (args.length < 3) {
            await ctx.reply("Используй: send <сумма> <username>");
            return;
        }

        const cmd = args[0];
        const amount = Number(args[1]);
        const targetUsername = args[2];
        if (cmd !== "sand") {
            await ctx.reply("Ошибка");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Ошибка отпрвки");
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            await ctx.reply("Введите корректную сумму");
            return;
        }

        const sender = await User.findOne({ name: ctx.from.username });

        if (!sender) {
            await ctx.reply("Вы не зарегистрированы");
            return;
        }

        if (sender.balance < amount) {
            await ctx.reply("Недостаточно средств для перевода");
            return;
        }

        const receiver = await User.findOne({ name: targetUsername });
        if (!receiver) {
            await ctx.reply(`Пользователь ${targetUsername} не найден`);
            return;
        }

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        await ctx.reply(`Вы успешно перевели ${amount} пользователю ${targetUsername}`);
    }

    public async attak(ctx: Context<any>): Promise<void> {

        if (!ctx.from || !ctx.message?.text) {
            await ctx.reply("Ошибка отправки");
            return;
        }


        const args = ctx.message.text.split(" ");
        if (args.length < 2) {
            await ctx.reply("Используй: atk <username>");
            return;
        }

        const cmd = args[0];
        const targetUsername = args[1];
        if (cmd !== "atk") {
            await ctx.reply("Ошибка");
            return;
        }

        const sender = await User.findOne({ name: ctx.from.username });

        if (!sender) {
            await ctx.reply("Ошибка тебя в базе не нашли");
            return;
        }

        const receiver = await User.findOne({ name: targetUsername });
        if (!receiver) {
            await ctx.reply(`Пользователь ${targetUsername} не найден`);
            return;
        }


        const num = Math.floor(Math.random() * 100) + 1;

        switch (true) {
            case num === 1:
                const amont = receiver.balance * 0.9;
                sender.balance += amont;
                receiver.balance -= amont;
                await ctx.reply(`Вы смогли украсть ${amont} (90%) денег у пользователя ${targetUsername}`);
                break;
            case num > 1 && num <= 10:
                const amont1 = receiver.balance * 0.5;
                sender.balance += amont1;
                receiver.balance -= amont1;
                await ctx.reply(`Вы смогли украсть ${amont1} (50%) денег у пользователя ${targetUsername}`);
                break;
            case num > 10 && num <= 30:
                const amont2 = receiver.balance * 0.2;
                sender.balance += amont2;
                receiver.balance -= amont2;
                await ctx.reply(`Вы смогли украсть ${amont2} (20%) денег у пользователя ${targetUsername}`);
                break;
            case num > 30 && num <= 60:
                await ctx.reply(`Вы лох`);
                break;
            case num > 60 && num <= 80:
                const amont3 = receiver.balance * 0.3;
                sender.balance -= amont3;
                receiver.balance += amont3;
                await ctx.reply(`Вы потеряли ${amont3} (30%) денег у пользователя ${targetUsername}`);
                break;
            case num > 80 && num <= 100:
                const amont4 = receiver.balance * 0.5;
                sender.balance -= amont4;
                receiver.balance += amont4;
                await ctx.reply(`Вы потеряли ${amont4} (50%) денег у пользователя ${targetUsername}`);
                break;
            default:
                await ctx.reply(`Вы лох`);
                break;
        }

        await sender.save();
        await receiver.save();

    }
}

export const rpg = new Rpg();
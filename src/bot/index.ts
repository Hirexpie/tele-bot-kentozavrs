import { Context, Markup } from "telegraf";
import { User } from "../db/entity/user";

export class BotCmd {
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

        const args = ctx.message.text.split(" ");

        const cmd = args[0];

        switch (cmd) {
            case "sand": await this.sendMony(ctx); break;
            case "cmd": await this.rulet(ctx); break;
        }

        switch (ctx.message.text.toLowerCase()) {
            case "иди на хуй": ctx.reply("кусай за хуй"); break;
            case "иди нахуй": ctx.reply("кусай за хуй"); break;
            case "иди наху": ctx.reply("кусай за хуй"); break;
        }
    }

    private async rulet(ctx: Context<any>): Promise<void> {
        await ctx.reply(
            "Выбери команду:",
            Markup.inlineKeyboard([
                [Markup.button.callback("ставить 100", "stav100"), Markup.button.callback("ставить 300", "stav300")],
                [Markup.button.callback("ставить 500", "stav500"), Markup.button.callback("ставить 1000", "stav1000")],
                [Markup.button.callback("информация про меня", "me"), Markup.button.callback("все пользавательи", "all")]
            ])
        );
    }

    private async sendMony(ctx: Context<any>): Promise<void> {

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

    public async stav100(ctx: Context<any>) {
        const price = 100;
        if (!ctx.from) {
            await ctx.reply("Ошибка");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Вы не зарегистрированы!");
            return;
        }

        if (user.balance <= price) {
            await ctx.reply("Недостаточно средств! Нужно минимум 100.");
            return;
        }

        const win = Math.random() < 0.1;

        if (win) {
            user.balance += price * 5;
            await user.save();
            await ctx.reply(`Вы выиграли! +${price * 4} к балансу!`);
        } else {
            user.balance -= price;
            await user.save();
            await ctx.reply(`Вы проиграли ${price}`);
        }
    }

    public async stav300(ctx: Context<any>) {
        const price = 300;
        if (!ctx.from) {
            await ctx.reply("Ошибка");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Вы не зарегистрированы!");
            return;
        }

        if (user.balance <= price) {
            await ctx.reply("Недостаточно средств! Нужно минимум 100.");
            return;
        }

        const win = Math.random() < 0.1;

        if (win) {
            user.balance += price * 5;
            await user.save();
            await ctx.reply(`Вы выиграли! +${price * 4} к балансу!`);
        } else {
            user.balance -= price;
            await user.save();
            await ctx.reply(`Вы проиграли ${price}`);
        }
    }
    public async stav500(ctx: Context<any>) {
        const price = 500;
        if (!ctx.from) {
            await ctx.reply("Ошибка");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Вы не зарегистрированы!");
            return;
        }

        if (user.balance <= price) {
            await ctx.reply("Недостаточно средств! Нужно минимум 100.");
            return;
        }

        const win = Math.random() < 0.1;

        if (win) {
            user.balance += price * 5;
            await user.save();
            await ctx.reply(`Вы выиграли! +${price * 4} к балансу!`);
        } else {
            user.balance -= price;
            await user.save();
            await ctx.reply(`Вы проиграли ${price}`);
        }
    }
    public async stav1000(ctx: Context<any>) {
        const price = 1000;
        if (!ctx.from) {
            await ctx.reply("Ошибка");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Вы не зарегистрированы!");
            return;
        }

        if (user.balance <= price) {
            await ctx.reply("Недостаточно средств! Нужно минимум 100.");
            return;
        }

        const win = Math.random() < 0.1;

        if (win) {
            user.balance += price * 5;
            await user.save();
            await ctx.reply(`Вы выиграли! +${price * 4} к балансу!`);
        } else {
            user.balance -= price;
            await user.save();
            await ctx.reply(`Вы проиграли ${price}`);
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
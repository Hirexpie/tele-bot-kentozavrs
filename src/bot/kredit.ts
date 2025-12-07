import { Context, Markup } from "telegraf";
import { Kred } from "../db/entity/Kred";
import { User } from "../db/entity/user";

class Kredit {
    public async Buttons(ctx: Context<any>): Promise<void> {
        await ctx.reply(
            "Выбери команду:",
            Markup.inlineKeyboard([
                [Markup.button.callback("Информация по кредитам", "infoKred")],
            ])
        );
    }

    public async getKredit(ctx: Context<any>) {
        if (!ctx.from || !ctx.message?.text) {
            await ctx.reply("Ошибка отправки");
            return;
        }


        const args = ctx.message.text.split(" ");
        if (args.length < 3) {
            await ctx.reply("Используй: kred <сумма> <месяц>");
            return;
        }
        const user = await User.findOne({ name: ctx.from.username })
        if (!user) {
            await ctx.reply("вы не зареганы");
            return
        }
        const cmd = args[0];
        if (cmd.toLowerCase() !== "kred") {
            await ctx.reply("error")
            return
        }
        const amount = Number(args[1] ?? 0);
        const moth = Number(args[2] ?? 0);

        const rates: Record<number, number> = {
            3: 1.3,
            6: 1.2,
            9: 1.15,
            12: 1.1
        };

        const rate = rates[moth];
        if (!rate) {
            await ctx.reply("Кредит можно брать только на 3, 6, 9 или 12 месяцев");
            return;
        }

        try {
            const kredit = await Kred.create({
                sum: amount * rate,
                moth,
                userId: String(user._id)
            });
            await User.findOneAndUpdate(
                { _id: user._id },
                { $inc: { balance: +amount } },
                { new: true }
            );

            await ctx.reply(`Кредит на ${moth} месяцев создан, сумма: ${kredit.sum}`);
        } catch (err) {
            console.error(err);
            await ctx.reply("Ошибка при создании кредита");
        }
    }

    public async kreditInfo(ctx: Context<any>) {
        const user = await User.findOne({ name: ctx.from?.username });
        if (!user) return ctx.reply("Вы не зарегистрированы");

        const kreds = await Kred.find({ userId: String(user._id) });
        if (!kreds.length) return ctx.reply("У вас нет кредитов");

        let msg = "Ваши кредиты:\n";
        kreds.forEach(k => {
            msg += `Сумма: ${k.sum.toFixed(2)}, Месяцы: ${k.moth}, Статус: ${k.isMoth ? "Оплачен" : "Не оплачен"}\n`;
        });

        await ctx.reply(msg);
    }
}

export const kredit = new Kredit();
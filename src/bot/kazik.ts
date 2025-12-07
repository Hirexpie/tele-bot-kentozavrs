import { Context, Markup } from "telegraf";
import { User } from "../db/entity/user";

class Kazik {
    public async rulet(ctx: Context<any>): Promise<void> {
        await ctx.reply(
            "Выбери команду:",
            Markup.inlineKeyboard([
                [Markup.button.callback("испытать удачу бесплатно 1/100", "freeMony")],
                [Markup.button.callback("депнуть 100 1/5", "stav100"), Markup.button.callback("депнуть 300 1/5", "stav300")],
                [Markup.button.callback("депнуть 500 1/5", "stav500"), Markup.button.callback("депнуть 1000 1/5", "stav1000")],
                [Markup.button.callback("информация про меня", "me"), Markup.button.callback("все пользавательи", "all")]
            ])
        );
    }

    public async freeMony(ctx: Context<any>, price: number) {
        if (!ctx.from) {
            await ctx.reply("Ошибка");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Вы не зарегистрированы!");
            return;
        }

        const win = Math.random() < 0.01;

        if (win) {
            user.balance += price;
            await user.save();
            await ctx.reply(`Вы выиграли! +${price} к балансу!`);
        } else {
            await user.save();
            await ctx.reply(`Вы лох`);
        }
    }


    public async stavka(ctx: Context<any>, price: number) {
        if (!ctx.from) {
            await ctx.reply("Ошибка");
            return;
        }

        const user = await User.findOne({ name: ctx.from.username });
        if (!user) {
            await ctx.reply("Вы не зарегистрированы!");
            return;
        }

        if (user.balance < price) {
            await ctx.reply(`Недостаточно средств! Нужно минимум ${price}.`);
            return;
        }

        const win = Math.random() < 0.2;

        if (win) {
            user.balance += price * 5;
            await user.save();
            await ctx.reply(`Вы выиграли! +${price * 4} к балансу!`);
        } else {
            user.balance -= price;
            await user.save();
            await ctx.reply(`Вы проиграли ${price}, Лооооох`);
        }
    }
}

export const kazik = new Kazik();
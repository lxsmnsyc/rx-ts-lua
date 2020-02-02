/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
import { MaybeObserver } from './types/observers';
import SubscriptionMaybeObserver from './observers/maybe/subscription';
import Subscription from './types/subscription';
import { LuaFunction, LuaConsumer, LuaAction } from './types/utils';
import LambdaMaybeObserver from './observers/maybe/lambda';

function isMaybeObserver<T>(value: any): value is MaybeObserver<T> {
  return (
    typeof value === 'object'
    && typeof value.onSubscribe === 'function'
    && typeof value.onComplete === 'function'
    && typeof value.onError === 'function'
    && typeof value.onSuccess === 'function'
  );
}

export type MaybeTransformer<T, R> = LuaFunction<Maybe<T>, Maybe<R>>;

export default abstract class Maybe<T> {
  public compose<R>(transformer: MaybeTransformer<T, R>): Maybe<R> {
    return transformer(this);
  }

  public pipe<Final>(
    ...transformers: MaybeTransformer<any, any>[]
  ): Maybe<Final> {
    return transformers.reduce((acc, x) => x(acc), this as Maybe<any>) as Maybe<Final>;
  }

  protected abstract subscribeActual(observer: MaybeObserver<T>): void;

  public subscribeWith(observer: MaybeObserver<T>): MaybeObserver<T> {
    this.subscribeActual(observer);
    return observer;
  }

  public subscribe(
    onSuccess: LuaConsumer<T>,
    onError: LuaConsumer<any>,
    onComplete: LuaAction,
  ): Subscription;

  public subscribe(onSuccess: LuaConsumer<T>, onError: LuaConsumer<any>): Subscription;

  public subscribe(onSuccess: LuaConsumer<T>): Subscription;

  public subscribe(observer: MaybeObserver<T>): Subscription;

  public subscribe(): Subscription;

  public subscribe(param1?: any, param2?: any, param3?: any): Subscription {
    const subscription = isMaybeObserver(param1)
      ? new SubscriptionMaybeObserver(param1)
      : new LambdaMaybeObserver(param1, param2, param3);

    this.subscribeActual(subscription);

    return subscription;
  }
}

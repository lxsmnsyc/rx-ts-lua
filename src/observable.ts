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
import { ObservableObserver } from './types/observers';
import SubscriptionObservableObserver from './observers/observable/subscription';
import Subscription from './types/subscription';
import { LuaFunction, LuaAction, LuaConsumer } from './types/utils';
import LambdaObservableObserver from './observers/observable/lambda';

function isObservableObserver<T>(value: any): value is ObservableObserver<T> {
  return (
    typeof value === 'object'
    && typeof value.onSubscribe === 'function'
    && typeof value.onComplete === 'function'
    && typeof value.onError === 'function'
    && typeof value.onNext === 'function'
  );
}

export type ObservableTransformer<T, R> = LuaFunction<Observable<T>, Observable<R>>;

export default abstract class Observable<T> {
  public compose<R>(transformer: ObservableTransformer<T, R>): Observable<R> {
    return transformer(this);
  }

  public pipe<Final>(
    ...transformers: ObservableTransformer<any, any>[]
  ): Observable<Final> {
    return transformers.reduce((acc, x) => x(acc), this as Observable<any>) as Observable<Final>;
  }

  protected abstract subscribeActual(observer: ObservableObserver<T>): void;

  public subscribeWith(observer: ObservableObserver<T>): ObservableObserver<T> {
    this.subscribeActual(observer);
    return observer;
  }

  public subscribe(
    onNext: LuaConsumer<T>,
    onError: LuaConsumer<any>,
    onComplete: LuaAction,
  ): Subscription;

  public subscribe(onNext: LuaConsumer<T>, onError: LuaConsumer<any>): Subscription;

  public subscribe(onNext: LuaConsumer<T>): Subscription;

  public subscribe(observer: ObservableObserver<T>): Subscription;

  public subscribe(): Subscription;

  public subscribe(param1?: any, param2?: any, param3?: any): Subscription {
    const subscription = isObservableObserver(param1)
      ? new SubscriptionObservableObserver(param1)
      : new LambdaObservableObserver(param1, param2, param3);

    this.subscribeActual(subscription);

    return subscription;
  }
}

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
import { SingleObserver } from './types/observers';
import Subscription from './types/subscription';
import SubscriptionSingleObserver from './observers/single/subscription';
import LambdaSingleObserver from './observers/single/lambda';
import { DEFAULT_THROW, DEFAULT_CONSUMER } from './utils/defaults';
import { Consumer } from './types/utils';

function isSingleObserver<T>(value: any): value is SingleObserver<T> {
  return (
    typeof value === 'object'
    && typeof value.onSubscribe === 'function'
    && typeof value.onSuccess === 'function'
    && typeof value.onError === 'function'
  );
}

export default abstract class Single<T> {
  public compose<R>(transformer: (input: Single<T>) => Single<R>): Single<R> {
    return transformer(this);
  }

  public pipe<Final>(
    ...transformers: ((input: Single<any>) => Single<any>)[]
  ): Single<Final> {
    return transformers.reduce((acc, x) => x(acc), this as Single<any>) as Single<Final>;
  }

  protected abstract subscribeActual(observer: SingleObserver<T>): void;

  public subscribeWith(observer: SingleObserver<T>): SingleObserver<T> {
    this.subscribeActual(observer);
    return observer;
  }

  public subscribe(onSuccess: Consumer<T>, onError: Consumer<any>): Subscription;

  public subscribe(onSuccess: Consumer<T>): Subscription;

  public subscribe(observer: SingleObserver<T>): Subscription;

  public subscribe(): Subscription;

  public subscribe(param1?: any, param2?: any): Subscription {
    let subscription: SingleObserver<T> & Subscription;

    if (typeof param1 === 'function') {
      if (typeof param2 === 'function') {
        subscription = new LambdaSingleObserver(param1, param2);
      } else {
        subscription = new LambdaSingleObserver(param1, DEFAULT_THROW);
      }
    } else if (isSingleObserver(param1)) {
      subscription = new SubscriptionSingleObserver(param1);
    } else if (typeof param2 === 'function') {
      subscription = new LambdaSingleObserver(DEFAULT_CONSUMER, param2);
    } else {
      subscription = new LambdaSingleObserver(DEFAULT_CONSUMER, DEFAULT_THROW);
    }

    this.subscribeActual(subscription);

    return subscription;
  }
}

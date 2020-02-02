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
import { SingleObserver } from '../../types/observers';
import Subscription from '../../types/subscription';
import ProtectedSingleObserver from './protected';

export default class SubscriptionSingleObserver<T> implements SingleObserver<T>, Subscription {
  private subscription?: Subscription;

  private alive = true;

  private upstream: SingleObserver<T>;

  constructor(observer: SingleObserver<T>) {
    this.upstream = new ProtectedSingleObserver(observer);
  }

  public onSubscribe(subscription: Subscription): void {
    if (this.alive) {
      this.subscription = subscription;
      this.upstream.onSubscribe(subscription);
    } else {
      subscription.cancel();
    }
  }

  public onSuccess(value: T): void {
    if (this.alive) {
      try {
        this.upstream.onSuccess(value);
      } catch (err) {
        this.cancel();
        throw err;
      }
    }
  }

  public onError(error: any): void {
    if (this.alive) {
      try {
        this.upstream.onError(error);
      } catch (err) {
        this.cancel();
        throw err;
      }
    } else {
      throw error;
    }
  }

  public cancel(): void {
    if (this.alive) {
      if (this.subscription) {
        this.subscription.cancel();
      }
      this.alive = false;
    }
  }
}

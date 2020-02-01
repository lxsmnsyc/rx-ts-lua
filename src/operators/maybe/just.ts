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
import Maybe from '../../maybe';
import { MaybeObserver } from '../../types/observers';
import SafeMaybeObserver from '../../observers/maybe/safe';
import EMPTY_SUBSCRIPTION from '../../subscriptions/empty';

class MaybeJust<T> extends Maybe<T> {
  private value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  protected subscribeActual(observer: MaybeObserver<T>): void {
    const newObserver = new SafeMaybeObserver(observer);

    newObserver.onSubscribe(EMPTY_SUBSCRIPTION);
    newObserver.onSuccess(this.value);
  }
}

export default function just<T>(this: void, value: T): Maybe<T> {
  return new MaybeJust<T>(value);
}

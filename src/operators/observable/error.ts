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
import Observable from '../../observable';
import { ObservableObserver } from '../../types/observers';
import SafeObservableObserver from '../../observers/observable/safe';
import EMPTY_SUBSCRIPTION from '../../subscriptions/empty';

class ObservableError<T> extends Observable<T> {
  private value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }

  protected subscribeActual(observer: ObservableObserver<T>): void {
    const newObserver = new SafeObservableObserver(observer);

    newObserver.onSubscribe(EMPTY_SUBSCRIPTION);
    newObserver.onError(this.value);
  }
}

export default function error<T>(this: void, value: any): Observable<T> {
  return new ObservableError<T>(value);
}

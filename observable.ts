type Observer = (data: any) => void;

class Observable {
    private _observers = new Map<string, Observer[]>();

    subscribe(bucket: string, obs: Observer) {
        const sub = this._observers.get(bucket);

        if (!sub) {
            this._observers.set(bucket, [obs]);
            return;
        }

        sub.push(obs);

        this._observers.set(bucket, sub);
    }

    notify(bucket: string, data: any) {
        const observers = this._observers.get(bucket);

        observers?.forEach(obs => obs(data));
    }
}

const obs = new Observable();

obs.subscribe("one", data => console.log('first message, bucket one: ', data));
obs.subscribe("one", data => console.log('second message, bucket one: ', data));
obs.subscribe("two", data => console.log('another message from bucket two: ', data));

obs.notify("one", "hello world");

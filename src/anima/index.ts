interface AnimaOptions<T> {
	loop?: boolean;
	target: T;
}

interface Timeline<T> {
	key: (frame: number, target: Partial<T>, options?: EasingFunc) => void;
}

type DefineAnimationFunc<T> = (timeline: Timeline<T>) => void;

interface DefineKey {
	frame: number;
	value: number;
	easing: EasingFunc;
}

type EasingFunc = (x: number) => number;

export const Anima = <T>(options: AnimaOptions<T>) => {
	return new AnimaInstance<T>(options.target);
};

export class AnimaInstance<T> {
	private target: T;
	private keys: Record<string, Record<any, DefineKey[]>> = {};
	private frame = 0;
	private runningAction?: string;
	private running = false;
	private animationEnd: (() => unknown) | null = null;

	constructor(target: T) {
		this.target = target;
	}

	def(name: string, timelineDefineFunc: DefineAnimationFunc<T>) {
		const timeline: Record<any, DefineKey[]> = {};
		const key: Timeline<T>["key"] = (frame, value, easing) => {
			(Object.entries(value) as [keyof T, number][])
				.filter(([, value]) => value != undefined)
				.forEach(([prop, value]) => {
					const keyTimeline = timeline[prop] ?? [];
					keyTimeline.push({
						frame,
						value,
						easing: easing ?? Easing.linear,
					});
					timeline[prop] = keyTimeline;
				});
		};
		timelineDefineFunc({ key });
		this.keys[name] = timeline;

		return this;
	}

	tick(delta: number): T {
		let isAnimationEnded = true;
		const action = this.runningAction;
		if (action && this.running) {
			this.frame += delta;
		}

		if (action) {
			const timeline = this.keys[action];
			for (const prop in timeline) {
				const keyTimeline = timeline[prop];
				if (keyTimeline.length == 0) continue;

				let i = 0;
				for (; i < keyTimeline.length; i++) {
					const props = keyTimeline[i];
					if (this.frame <= props.frame) break;
				}
				i = Math.min(i, keyTimeline.length - 1);

				let k = keyTimeline.length - 1;
				for (; k >= 0; k--) {
					const props = keyTimeline[k];
					if (this.frame > props.frame) break;
				}
				i = Math.max(i, 0);

				const from = keyTimeline[k];
				const to = keyTimeline[i];

				if (from === to) {
					(this.target as any)[prop] = from.value as number;
				} else {
					const bewteenFromTo = to.frame - from.frame;
					const frameOriginFrom = this.frame - from.frame;
					const x = from.easing(frameOriginFrom / bewteenFromTo);
					const pos = to.value * x + from.value * (1 - x);
					(this.target as any)[prop] = pos;
				}

				if (k !== i || keyTimeline.length - 1 !== k) {
					isAnimationEnded = false;
				}
			}
		}

		if (isAnimationEnded) {
			this.execAnimationEndIfNeeded();
		}

		return this.target;
	}

	start(name: string, animationEnd?: () => unknown) {
		this.runningAction = name;
		this.running = true;
		this.frame = 0;
		if (animationEnd) {
			this.animationEnd = animationEnd;
		}
	}

	stop() {
		this.running = false;
		this.execAnimationEndIfNeeded();
	}

	execAnimationEndIfNeeded() {
		if (this.animationEnd) {
			this.animationEnd();
			this.animationEnd = null;
		}
	}
}

export const Easing = {
	step: (x: number) => 0,
	linear: (x: number) => x,
	easeInSine: (x: number) => 1 - Math.cos((x * Math.PI) / 2),
	easeOutSine: (x: number) => Math.sin((x * Math.PI) / 2),
	easeOutElastic: (x: number) => {
		const c4 = (2 * Math.PI) / 3;
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
	},
	easeInBack: (x: number) => {
		const c1 = 1.70158;
		const c3 = c1 + 1;

		return c3 * x * x * x - c1 * x * x;
	},
};

Anima({ loop: true, target: { x: 0, y: 0 } }).def("name", ({ key }) => {
	key(0, { x: 10, y: 10 });
	key(10, { x: 10, y: 10 });
});

import { Gacha, GachaItem } from "@/interfaces";
import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useMeasure } from "react-use";
import useMergedRef from "@react-hook/merged-ref";
import * as PIXI from "pixi.js";
import { Anima, AnimaInstance, Easing } from "@/anima";

global.PIXI = PIXI;
require("pixi-heaven");

const { easeInSine, easeOutSine, easeOutElastic, step, easeInBack } = Easing;

const colorBrend = (from: number, to: number, x: number) => {
	const fr = from & 0xff0000;
	const fg = from & 0x00ff00;
	const fb = from & 0x0000ff;
	const tr = to & 0xff0000;
	const tg = to & 0x00ff00;
	const tb = to & 0x0000ff;
	const u = 1 - x;
	return (
		((fr * u + tr * x) & 0xff0000) +
		((fg * u + tg * x) & 0x00ff00) +
		((fb * u + tb * x) & 0x0000ff)
	);
};

const hsvToRgb = (h: number, s: number, v: number) => {
	//https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

	const c = v * s;
	const hp = h / 60;
	const x = c * (1 - Math.abs((hp % 2) - 1));

	let r = 0,
		g = 0,
		b = 0;
	if (0 <= hp && hp < 1) {
		[r, g, b] = [c, x, 0];
	}
	if (1 <= hp && hp < 2) {
		[r, g, b] = [x, c, 0];
	}
	if (2 <= hp && hp < 3) {
		[r, g, b] = [0, c, x];
	}
	if (3 <= hp && hp < 4) {
		[r, g, b] = [0, x, c];
	}
	if (4 <= hp && hp < 5) {
		[r, g, b] = [x, 0, c];
	}
	if (5 <= hp && hp < 6) {
		[r, g, b] = [c, 0, x];
	}

	const m = v - c;
	[r, g, b] = [r + m, g + m, b + m];

	r = Math.floor(r * 255) << 16;
	g = Math.floor(g * 255) << 8;
	b = Math.floor(b * 255);

	return r + g + b;
};

interface Props {
	randomGacha: () => GachaItem;
	addPremium: (image: string) => void;
}

const defaultDrawProp = {
	gachaR: 0,
	gachaX: 0,
	gachaY: 0,
	gachaSX: 1,
	gachaSY: 1,
	bgBr: 0,
	bgTp: 0,
	crushBgT: 0,
	crushOut: 0,
	crushIn: 0,
	crushW: 0,
	shineT: 0,
	shineBr: -1,
	particleT: 0,
	particleTr: 1,
	charaBr: 1,
	charaSX: 0,
	charaSY: 0,
	charaY: 0,
	absorb0: 0,
	absorb1: 0,
	absorb2: 0,
	flash: 0,
	text: 0,
};

export default ({ randomGacha, addPremium }: Props) => {
	const [appMeasureRef, { width, height }] = useMeasure();
	const appElemRef = useRef<HTMLDivElement>(null);
	const appRootRef = useMergedRef(appMeasureRef, appElemRef);

	const [visibleButton, setVisibleButton] = useState(true);

	const graphicRef = useRef<{
		app: PIXI.Application;
		chara: PIXI.heaven.Sprite;
		charaName: PIXI.Text;
		anima: AnimaInstance<typeof defaultDrawProp>;
	} | null>(null);

	useEffect(() => {
		const app = new PIXI.Application({
			width,
			height,
			transparent: true,
			antialias: true,
		});

		appElemRef.current?.append(app.view);

		const container = new PIXI.Container();
		container.zIndex = 1;
		container.name = "main";
		container.sortableChildren = true;
		container.x = app.screen.width / 2;
		container.y = app.screen.height / 2;
		app.stage.addChild(container);

		const background = new PIXI.Graphics();
		background.zIndex = 0;
		app.stage.addChild(background);

		const gacha = PIXI.Sprite.from("/gacha.png");
		gacha.anchor.set(0.5);
		container.addChild(gacha);

		const effect = new PIXI.Graphics();
		effect.zIndex = 2;
		effect.blendMode = PIXI.BLEND_MODES.ADD;
		container.addChild(effect);

		const chara = new PIXI.heaven.Sprite(PIXI.Texture.EMPTY);
		chara.anchor.set(0.5);
		chara.zIndex = 3;
		container.addChild(chara);

		const textStyle = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 36,
			fontWeight: "bold",
			fill: "#ffffff",
			stroke: "#000000",
			lineJoin: "round",
			strokeThickness: 6.5,
		});
		const charaName = new PIXI.Text("", textStyle);
		charaName.y = -200;
		charaName.anchor.set(0.5);
		charaName.zIndex = 4;
		container.addChild(charaName);

		container.sortChildren();
		app.stage.sortableChildren = true;

		const anima = Anima({ target: { ...defaultDrawProp } })
			.def("idle", ({ key }) => {
				key(0, { ...defaultDrawProp });
				key(0, { gachaR: 1 }, easeOutElastic);
				key(20, { gachaR: 0 });
			})
			.def("openSSR", ({ key }) => {
				key(0, { ...defaultDrawProp });

				// gacha Scale
				key(0, { gachaSX: 1, gachaSY: 1 }, easeOutSine);
				key(4, { gachaSX: 1.1, gachaSY: 1.1 }, easeInSine);
				key(10, { gachaSX: 0, gachaSY: 0 });
				key(220, { gachaSX: 0, gachaSY: 0 }, easeOutElastic);
				key(250, { gachaSX: 1, gachaSY: 1 });

				// gacha rotation
				key(0, { gachaR: 0 }, easeOutSine);
				key(4, { gachaR: -0.5 }, easeInSine);
				key(10, { gachaR: 3 }, step);
				key(200, { gachaR: 0 }, easeInSine);

				// chara
				key(30, { charaBr: 1 });
				key(50, { charaBr: 0 });

				key(20, { charaSX: 0, charaSY: 0 }, easeOutElastic);
				key(40, { charaSX: 1, charaSY: 1 });

				key(180, { charaY: 0 }, easeInBack);
				key(200, { charaY: 1000 });

				// background
				key(10, { bgTp: 0.8 });
				key(150, { bgTp: 0.8 });
				key(200, { bgTp: 0 });

				key(10, { crushBgT: 0, crushOut: 0 });
				key(20, { crushBgT: 1, crushOut: 200 }, easeOutSine);
				key(30, { crushBgT: 0, crushOut: 180 }, easeInSine);

				key(20, { crushW: 0 }, easeOutSine);
				key(30, { crushW: 1 });

				key(10, { crushIn: 0 }, easeOutSine);
				key(30, { crushIn: 180 });

				// shine
				key(10, { shineBr: -1 });
				key(50, { shineBr: 0 });
				key(150, { shineBr: 0 });
				key(200, { shineBr: -1 });

				key(350, { shineT: 100 });

				// particles
				key(10, { particleT: 0 }, easeOutSine);
				key(40, { particleT: 80 });
				key(10, { particleTr: 0 });
				key(10, { particleTr: 1 });
				key(40, { particleTr: 0 });

				key(40, { text: 0 }, easeOutElastic);
				key(70, { text: 1 });
				key(180, { text: 1 });
				key(200, { text: 0 });
			})
			.def("openN", ({ key }) => {
				key(0, { ...defaultDrawProp });

				// gacha Scale
				key(0, { gachaSX: 1, gachaSY: 1 }, easeOutSine);
				key(4, { gachaSX: 1.1, gachaSY: 1.1 }, easeInSine);
				key(10, { gachaSX: 0, gachaSY: 0 });
				key(220, { gachaSX: 0, gachaSY: 0 }, easeOutElastic);
				key(250, { gachaSX: 1, gachaSY: 1 });

				// gacha rotation
				key(0, { gachaR: 0 }, easeOutSine);
				key(4, { gachaR: -0.5 }, easeInSine);
				key(10, { gachaR: 3 }, step);
				key(200, { gachaR: 0 }, easeInSine);

				// chara
				key(30, { charaBr: 1 });
				key(50, { charaBr: 0 });

				key(20, { charaSX: 0, charaSY: 0 }, easeOutElastic);
				key(40, { charaSX: 1, charaSY: 1 });

				key(180, { charaY: 0 }, easeInBack);
				key(200, { charaY: 1000 });

				// background
				key(10, { bgTp: 0.8 });
				key(150, { bgTp: 0.8 });
				key(200, { bgTp: 0 });

				key(10, { absorb0: 0 });
				key(30, { absorb0: 1 });
				key(13, { absorb1: 0 });
				key(33, { absorb1: 1 });
				key(16, { absorb2: 0 });
				key(36, { absorb2: 1 });

				key(30, { flash: 0 }, easeOutSine);
				key(50, { flash: 1 });

				key(40, { text: 0 }, easeOutElastic);
				key(70, { text: 1 });
				key(180, { text: 1 });
				key(200, { text: 0 });
			});

		const lights = new Array(100).fill(null).map(() => ({
			dir: Math.random() * Math.PI * 2,
			weight: Math.random() * Math.PI * 0.03 + 0.01,
			speed: Math.random() * Math.PI * 0.01 - Math.PI * 0.005,
			power: Math.random() * 0.3 + 0.2,
		}));

		const particles = new Array(60).fill(null).map((_, i) => ({
			dir: ((6 * i) / 180) * Math.PI,
			power: (i % 6) / 3 + 6,
			color: hsvToRgb(i * 6, 0.3, 1),
		}));

		app.ticker.add((delta) => {
			const w = app.view.width;
			const h = app.view.height;
			const prop = anima.tick(delta);

			gacha.position.set(prop.gachaX, prop.gachaY);
			gacha.scale.set(prop.gachaSX, prop.gachaSY);
			gacha.rotation = prop.gachaR;

			const charaBr = prop.charaBr;
			chara.color.setDark(charaBr, charaBr, charaBr);
			chara.scale.set(prop.charaSX, prop.charaSY);
			chara.position.y = prop.charaY;

			background.clear();
			background.beginFill(0, prop.bgTp);
			background.drawRect(0, 0, w, h);
			background.endFill();

			effect.clear();
			effect.beginFill(
				colorBrend(0xff2244, 0xffffff, prop.crushW),
				prop.crushBgT
			);
			effect.drawCircle(0, 0, prop.crushOut);
			effect.beginHole();
			if (prop.crushIn > 0) effect.drawCircle(0, 0, prop.crushIn);
			effect.endHole();
			effect.endFill();

			lights.forEach(({ dir, weight, speed, power }) => {
				const transparent = power + prop.shineBr;
				if (transparent > 0) {
					effect.beginFill(0xffee88, Math.min(transparent, 1));
					effect.moveTo(0, 0);
					effect.lineTo(
						Math.cos(dir - weight + speed * prop.shineT) * 1000,
						Math.sin(dir - weight + speed * prop.shineT) * 1000
					);
					effect.lineTo(
						Math.cos(dir + weight + speed * prop.shineT) * 1000,
						Math.sin(dir + weight + speed * prop.shineT) * 1000
					);
					effect.closePath();
					effect.endFill();
				}
			});
			if (prop.particleT > 0 && prop.particleTr > 0) {
				particles.forEach(({ dir, power, color }) => {
					effect.beginFill(color, prop.particleTr);
					const angle =
						dir +
						((power + 10) * 0.1 * prop.particleT * Math.PI) / 180;
					effect.drawCircle(
						Math.cos(angle) * power * prop.particleT,
						Math.sin(angle) * power * prop.particleT,
						10
					);
					effect.endFill();
				});
			}
			[prop.absorb0, prop.absorb1, prop.absorb2].forEach((i) => {
				if (0 < i && i < 1) {
					effect.beginFill(0xaaddff, i * 0.5);
					effect.drawCircle(0, 0, (1 - i) * 1000);
					effect.endFill();
				}
			});

			effect.lineStyle(4, 0xffcc44, 1);
			for (let i = 0; i < 20; i++) {
				const angle = (i * 18 * Math.PI) / 180;
				const ax = Math.cos(angle);
				const ay = Math.sin(angle);
				const f = Math.min(1, prop.flash);
				const t = f;
				const t2 = Math.max((f - 0.5) / 0.5, 0);
				effect.moveTo(ax * t2 * 300, ay * t2 * 300);
				effect.lineTo(ax * t * 300, ay * t * 300);
			}

			charaName.scale.set(prop.text);
			charaName.alpha = Math.min(1, Math.max(0, prop.text));
		});

		graphicRef.current = { app, chara, charaName, anima };

		return () => {
			app.destroy();
		};
	}, []);

	useEffect(() => {
		const graphic = graphicRef.current;
		if (!graphic) return;

		const { app } = graphic;

		app.renderer.resize(width, height);
		const container = app.stage.getChildByName("main");
		if (container) {
			container.x = app.screen.width / 2;
			container.y = app.screen.height / 2;
		}
	}, [width, height]);

	const start = async () => {
		const graphic = graphicRef.current;
		if (!graphic) return;

		setVisibleButton(false);

		const { chara, charaName, anima } = graphic;
		const { image, effect, name } = randomGacha();

		const texture = await PIXI.Texture.fromURL(image);
		chara.texture = texture;

		charaName.text = name;

		let animName = "idle";
		switch (effect) {
			case "normal":
				animName = "openN";
				break;
			case "ssr":
				animName = "openSSR";
				break;
		}
		anima.start(animName, () => {
			setVisibleButton(true);
			addPremium(image);
		});
	};

	return (
		<Box>
			<Box
				ref={appRootRef}
				zIndex={-1}
				position="fixed"
				left={0}
				right={0}
				top={0}
				bottom={0}
			/>
			<Flex
				zIndex={0}
				position="fixed"
				left={0}
				right={0}
				top="50%"
				bottom={0}
				justifyContent="center"
				alignItems="center"
				display={visibleButton ? "flex" : "none"}
			>
				<Button onClick={start} colorScheme="blue">
					ガチャる
				</Button>
			</Flex>
		</Box>
	);
};

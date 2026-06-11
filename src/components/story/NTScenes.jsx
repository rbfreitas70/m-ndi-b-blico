// Cenas SVG do Novo Testamento — construídas com um helper de emojis posicionados

const Scene = ({ bg = '#E3F2FD', ground, groundColor = '#8BC34A', items = [] }) => (
  <svg viewBox="0 0 280 200" className="w-full drop-shadow-lg rounded-3xl" style={{ background: bg }}>
    <rect width="280" height="200" fill={bg} />
    {ground && <rect y="150" width="280" height="50" fill={groundColor} />}
    {items.map((it, i) => (
      <text key={i} x={it.x} y={it.y} fontSize={it.s}>{it.e}</text>
    ))}
  </svg>
);

export const NT_SCENES = {
  // Nascimento
  angel_mary: <Scene bg="#E8EAF6" ground items={[
    { e: '👼', x: 70, y: 110, s: 44 }, { e: '🧕', x: 165, y: 145, s: 40 },
    { e: '✨', x: 120, y: 60, s: 26 }, { e: '🌟', x: 50, y: 50, s: 22 }]} />,
  mary_joy: <Scene bg="#FFF8E1" ground items={[
    { e: '🧕', x: 115, y: 145, s: 44 }, { e: '🙏', x: 90, y: 95, s: 26 },
    { e: '💛', x: 165, y: 85, s: 26 }, { e: '✨', x: 60, y: 70, s: 22 }]} />,
  bethlehem: <Scene bg="#1a237e" ground groundColor="#5D4037" items={[
    { e: '🏘️', x: 90, y: 140, s: 52 }, { e: '🌟', x: 130, y: 50, s: 34 },
    { e: '🐪', x: 30, y: 148, s: 26 }, { e: '⭐', x: 200, y: 65, s: 18 }, { e: '⭐', x: 60, y: 45, s: 16 }]} />,
  manger: <Scene bg="#3E2723" items={[
    { e: '👶', x: 120, y: 130, s: 36 }, { e: '🧕', x: 60, y: 145, s: 32 },
    { e: '🧔', x: 180, y: 145, s: 32 }, { e: '🌟', x: 125, y: 50, s: 30 },
    { e: '🐄', x: 25, y: 180, s: 26 }, { e: '🐑', x: 220, y: 182, s: 24 }]} />,
  shepherds: <Scene bg="#1a237e" ground items={[
    { e: '🧑‍🌾', x: 60, y: 145, s: 34 }, { e: '🧑‍🌾', x: 140, y: 148, s: 30 },
    { e: '🐑', x: 100, y: 145, s: 24 }, { e: '🐑', x: 200, y: 146, s: 24 },
    { e: '👼', x: 110, y: 70, s: 38 }, { e: '✨', x: 175, y: 55, s: 22 }]} />,
  star_east: <Scene bg="#0D0221" items={[
    { e: '🌟', x: 125, y: 60, s: 44 }, { e: '🐪', x: 50, y: 160, s: 32 },
    { e: '🐪', x: 110, y: 165, s: 32 }, { e: '🐪', x: 170, y: 160, s: 32 },
    { e: '⭐', x: 220, y: 45, s: 16 }, { e: '⭐', x: 40, y: 55, s: 14 }]} />,
  magi_gifts: <Scene bg="#FFF8E1" ground items={[
    { e: '🤴', x: 35, y: 140, s: 34 }, { e: '🤴', x: 95, y: 145, s: 34 }, { e: '🤴', x: 155, y: 140, s: 34 },
    { e: '👶', x: 220, y: 145, s: 30 }, { e: '🎁', x: 70, y: 100, s: 22 }, { e: '🌟', x: 215, y: 70, s: 26 }]} />,

  // Milagres
  jordan_river: <Scene bg="#E0F7FA" items={[
    { e: '🌊', x: 30, y: 170, s: 28 }, { e: '🌊', x: 120, y: 175, s: 28 }, { e: '🌊', x: 210, y: 170, s: 28 },
    { e: '🧔', x: 100, y: 140, s: 38 }, { e: '🧔‍♂️', x: 160, y: 138, s: 34 }, { e: '💧', x: 135, y: 90, s: 22 }]} />,
  dove_heaven: <Scene bg="#E3F2FD" items={[
    { e: '🕊️', x: 120, y: 75, s: 40 }, { e: '☀️', x: 200, y: 50, s: 30 },
    { e: '🧔', x: 115, y: 155, s: 40 }, { e: '✨', x: 70, y: 60, s: 24 }, { e: '🌊', x: 120, y: 190, s: 24 }]} />,
  wedding: <Scene bg="#FCE4EC" ground groundColor="#BCAAA4" items={[
    { e: '💒', x: 100, y: 130, s: 50 }, { e: '🎉', x: 50, y: 90, s: 26 },
    { e: '👰', x: 50, y: 148, s: 28 }, { e: '🤵', x: 195, y: 148, s: 28 }, { e: '🎵', x: 200, y: 80, s: 22 }]} />,
  water_wine: <Scene bg="#FFF3E0" ground groundColor="#BCAAA4" items={[
    { e: '🏺', x: 60, y: 145, s: 38 }, { e: '🏺', x: 130, y: 148, s: 38 },
    { e: '🍷', x: 200, y: 140, s: 34 }, { e: '✨', x: 160, y: 90, s: 28 }, { e: '😲', x: 40, y: 85, s: 24 }]} />,
  crowd_hill: <Scene bg="#E8F5E9" ground items={[
    { e: '🧔', x: 120, y: 95, s: 36 },
    { e: '👤', x: 30, y: 145, s: 22 }, { e: '👤', x: 70, y: 150, s: 22 }, { e: '👤', x: 110, y: 148, s: 22 },
    { e: '👤', x: 150, y: 150, s: 22 }, { e: '👤', x: 190, y: 146, s: 22 }, { e: '👤', x: 230, y: 150, s: 22 }]} />,
  bread_fish: <Scene bg="#FFF8E1" ground items={[
    { e: '🍞', x: 60, y: 110, s: 34 }, { e: '🍞', x: 120, y: 95, s: 30 },
    { e: '🐟', x: 175, y: 110, s: 32 }, { e: '🐟', x: 220, y: 95, s: 26 },
    { e: '🧺', x: 110, y: 150, s: 36 }, { e: '✨', x: 45, y: 60, s: 24 }]} />,
  storm_boat: <Scene bg="#37474F" items={[
    { e: '⛵', x: 100, y: 130, s: 48 }, { e: '🌊', x: 30, y: 170, s: 30 }, { e: '🌊', x: 180, y: 175, s: 30 },
    { e: '⚡', x: 60, y: 55, s: 28 }, { e: '🌧️', x: 150, y: 45, s: 26 }, { e: '😱', x: 200, y: 110, s: 22 }]} />,
  calm_sea: <Scene bg="#E0F7FA" items={[
    { e: '⛵', x: 105, y: 120, s: 46 }, { e: '🧔', x: 130, y: 95, s: 26 },
    { e: '🌊', x: 50, y: 175, s: 22 }, { e: '🌊', x: 190, y: 178, s: 22 },
    { e: '☀️', x: 210, y: 50, s: 30 }, { e: '🕊️', x: 50, y: 60, s: 22 }]} />,

  // Parábolas
  road_jericho: <Scene bg="#FFF3E0" ground groundColor="#D7B07A" items={[
    { e: '🤕', x: 110, y: 150, s: 36 }, { e: '🚶', x: 40, y: 130, s: 26 },
    { e: '🚶', x: 200, y: 125, s: 26 }, { e: '🌵', x: 240, y: 145, s: 24 }, { e: '☀️', x: 60, y: 55, s: 28 }]} />,
  samaritan_help: <Scene bg="#E8F5E9" ground items={[
    { e: '🧑', x: 90, y: 140, s: 34 }, { e: '🤕', x: 150, y: 148, s: 32 },
    { e: '🫶', x: 120, y: 95, s: 26 }, { e: '🐴', x: 210, y: 145, s: 30 }, { e: '💛', x: 60, y: 75, s: 24 }]} />,
  son_leaves: <Scene bg="#FFF8E1" ground items={[
    { e: '🚶', x: 180, y: 140, s: 36 }, { e: '💰', x: 215, y: 110, s: 24 },
    { e: '👴', x: 50, y: 145, s: 34 }, { e: '😢', x: 75, y: 100, s: 22 }, { e: '🏠', x: 20, y: 120, s: 28 }]} />,
  pigs_field: <Scene bg="#EFEBE9" ground groundColor="#8D6E63" items={[
    { e: '🐷', x: 50, y: 148, s: 30 }, { e: '🐷', x: 110, y: 152, s: 30 },
    { e: '😞', x: 180, y: 140, s: 36 }, { e: '🌧️', x: 80, y: 55, s: 24 }, { e: '💭', x: 220, y: 90, s: 24 }]} />,
  father_hug: <Scene bg="#FFF3E0" ground items={[
    { e: '🤗', x: 110, y: 140, s: 48 }, { e: '💛', x: 90, y: 80, s: 26 },
    { e: '🎉', x: 180, y: 90, s: 26 }, { e: '🏠', x: 220, y: 140, s: 30 }, { e: '✨', x: 50, y: 65, s: 22 }]} />,
  sycamore_tree: <Scene bg="#E8F5E9" ground items={[
    { e: '🌳', x: 90, y: 140, s: 56 }, { e: '🧍', x: 120, y: 85, s: 24 },
    { e: '🧔', x: 180, y: 148, s: 34 }, { e: '👀', x: 130, y: 60, s: 18 }]} />,
  zacchaeus_house: <Scene bg="#FFF8E1" ground groundColor="#BCAAA4" items={[
    { e: '🏠', x: 90, y: 135, s: 48 }, { e: '🧔', x: 60, y: 150, s: 30 },
    { e: '🧍', x: 180, y: 150, s: 30 }, { e: '💰', x: 210, y: 105, s: 24 }, { e: '💛', x: 130, y: 70, s: 26 }]} />,

  // Páscoa e Igreja
  cross_hill: <Scene bg="#4527A0" ground groundColor="#5D4037" items={[
    { e: '✝️', x: 115, y: 110, s: 52 }, { e: '✝️', x: 50, y: 130, s: 32 }, { e: '✝️', x: 195, y: 130, s: 32 },
    { e: '😢', x: 100, y: 175, s: 20 }, { e: '☁️', x: 200, y: 50, s: 24 }]} />,
  empty_tomb: <Scene bg="#E8EAF6" ground items={[
    { e: '🪨', x: 180, y: 145, s: 40 }, { e: '🕳️', x: 90, y: 145, s: 44 },
    { e: '👼', x: 110, y: 95, s: 32 }, { e: '✨', x: 60, y: 65, s: 24 }, { e: '🌅', x: 215, y: 70, s: 28 }]} />,
  risen_jesus: <Scene bg="#FFF8E1" ground items={[
    { e: '🧔', x: 115, y: 125, s: 44 }, { e: '✨', x: 80, y: 70, s: 28 }, { e: '✨', x: 170, y: 65, s: 28 },
    { e: '🌟', x: 125, y: 45, s: 26 }, { e: '🙌', x: 40, y: 145, s: 26 }, { e: '🙌', x: 210, y: 145, s: 26 }]} />,
  upper_room: <Scene bg="#3E2723" items={[
    { e: '👤', x: 50, y: 140, s: 26 }, { e: '👤', x: 100, y: 145, s: 26 }, { e: '👤', x: 150, y: 140, s: 26 },
    { e: '👤', x: 200, y: 145, s: 26 }, { e: '🙏', x: 125, y: 100, s: 28 }, { e: '🕯️', x: 230, y: 100, s: 22 }]} />,
  tongues_fire: <Scene bg="#1a237e" items={[
    { e: '🔥', x: 55, y: 95, s: 28 }, { e: '🔥', x: 115, y: 85, s: 30 }, { e: '🔥', x: 175, y: 95, s: 28 },
    { e: '👤', x: 50, y: 150, s: 28 }, { e: '👤', x: 110, y: 155, s: 28 }, { e: '👤', x: 170, y: 150, s: 28 },
    { e: '🕊️', x: 125, y: 45, s: 30 }, { e: '✨', x: 220, y: 70, s: 22 }]} />,
};
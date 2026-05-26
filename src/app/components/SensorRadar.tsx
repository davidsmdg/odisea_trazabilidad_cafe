import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface SensorRadarProps {
  data: {
    attribute: string;
    value: number;
  }[];
}

export function SensorRadar({ data }: SensorRadarProps) {
  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ fill: '#666', fontSize: 12, fontFamily: 'var(--font-ui)' }} 
          />
          <Radar
            name="Perfil Sensorial"
            dataKey="value"
            stroke="#a35c5c"
            fill="#a35c5c"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

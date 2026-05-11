import { Card, CardContent } from "../ui/card";
import { Users } from "lucide-react";
export default function UserCard({title , value , icon , iconColor}: {title: string , value: string , icon: any , iconColor: string}) {
  return (
    <Card className="w-64 shadow-sm border-slate-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
              <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
          
              {icon}
            </div>
          </CardContent>
        </Card>
  );
}
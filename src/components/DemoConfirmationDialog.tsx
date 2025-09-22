import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DemoConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoConfirmationDialog({ open, onOpenChange }: DemoConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Demande envoyée
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Votre demande a été prise en compte. Nous vous contacterons dans les plus brefs délais.
          </p>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
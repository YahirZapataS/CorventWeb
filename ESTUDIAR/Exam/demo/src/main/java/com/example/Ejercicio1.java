package com.example;
public class Ejercicio1 {
    public static void main(String[] args) {
        
       
        System.out.println(clasificar(0, 11));
    }
    public static String clasificar(int num1, int num2){
        if (1 <= num1 && num1 <=200 && 1 <=num2 && num2<=200) {
            if (num1%2==0 && num2%2==0) {
                return "PARES";
            }if (num1%2!=0 && num2%2!=0) {
                return "IMPARES";
            
            
            }if (num1%2==0 && num2%2!=0) {
                return "PAR E IMPAR";
    
            }if (num1%2!=0 && num2%2==0) {
                return "IMPAR Y PAR";
                
            }
        }
        return "FUERA DEL RANGO";
       
     
    }
    
}

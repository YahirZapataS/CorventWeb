package com.example;

import java.util.Scanner;

public class Ejercicio {
    public static void main(String[] args) {
        Scanner lector = new Scanner(System.in);
        System.out.println("hola");
        System.out.println("ingresa un numero positivo");
        
        int numero1 = lector.nextInt();
        lector.close();
        obtenerValor(numero1);
        System.out.println(obtenerValor(numero1));
        
        
        
        
        

    }
    public static String obtenerValor(int numero){
       
        
        if (numero >0 && numero <=11) {
            return "A";            
        }if (numero >=12 && numero <=23) {
            return "B"; 
        }if (numero >=24 && numero <=47) {
            return "C"; 
        }if (numero >=48) {
            return "N"; 
        }else if (numero <=0) {
            
        }else{
            throw new IllegalArgumentException("el numero no puede ser decimal");
        }
        return "N";
        
            
    }
    
}

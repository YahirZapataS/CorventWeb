package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

public class EjercicioTest {
    @Test
    void testObtenerValor() {
        assertEquals("A", Ejercicio.obtenerValor(2));

    }
    @Test
    void testObtenerValor02(){
        assertThrows(IllegalArgumentException.class,() -> {
            Ejercicio.obtenerValor(12);}, "el numero no puede ser decimal");
    }



}

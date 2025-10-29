Shader "Hidden/ColorBlindSimulation"
{
    /*
     * Color Blind Simulation Shader
     *
     * Applies color transformation matrices to simulate various types of color vision deficiency.
     * Uses scientifically-validated transformation matrices based on research by:
     * - Gustavo M. Machado, Manuel M. Oliveira, and Leandro A. F. Fernandes
     * - "A Physiologically-based Model for Simulation of Color Vision Deficiency"
     *
     * Supported Simulations:
     * - Protanopia (red-blind)
     * - Deuteranopia (green-blind)
     * - Tritanopia (blue-blind)
     * - Protanomaly (red-weak)
     * - Deuteranomaly (green-weak)
     * - Tritanomaly (blue-weak)
     * - Achromatopsia (total color-blind)
     *
     * Part of zSpace Accessibility Standards Unity Framework v3.1.0
     */

    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _ColorMatrix ("Color Transform Matrix", Matrix) = ""
    }

    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float4x4 _ColorMatrix;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // Sample the original texture
                fixed4 col = tex2D(_MainTex, i.uv);

                // Apply color transformation matrix
                // Matrix multiplication: result = matrix * color
                fixed3 transformedColor;
                transformedColor.r = dot(_ColorMatrix[0].rgb, col.rgb);
                transformedColor.g = dot(_ColorMatrix[1].rgb, col.rgb);
                transformedColor.b = dot(_ColorMatrix[2].rgb, col.rgb);

                // Clamp to valid range [0, 1]
                transformedColor = saturate(transformedColor);

                // Return transformed color with original alpha
                return fixed4(transformedColor, col.a);
            }
            ENDCG
        }
    }

    Fallback "Diffuse"
}
